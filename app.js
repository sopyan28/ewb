const DEBUG = true;

// Namespace for custom Auth0 claims (must match the Action you create in Auth0)
const ROLES_CLAIM = 'https://ewb-bca/roles';

const express = require("express");
const logger = require("morgan");
const { auth, requiresAuth } = require('express-openid-connect');
const db = require('./db/db_connection');
const app = express();
const port = 3000;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET || 'change_this_secret',
    baseURL: process.env.AUTH0_BASE_URL || `http://localhost:${port}`,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

app.use(auth(authConfig));

// Expose auth state, user, and computed role flags to all views
app.use((req, res, next) => {
    const authenticated = req.oidc?.isAuthenticated?.() ?? false;
    const userRoles = authenticated ? (req.oidc.user?.[ROLES_CLAIM] ?? []) : [];
    res.locals.isAuthenticated = authenticated;
    res.locals.user = authenticated ? req.oidc.user : null;
    res.locals.userRoles = userRoles;
    res.locals.canPost = userRoles.includes('leadership') || userRoles.includes('president');
    res.locals.canDelete = userRoles.includes('president');
    next();
});

// Middleware: requires the user to have at least one of the given roles
function hasRole(...roles) {
    return (req, res, next) => {
        const userRoles = req.oidc.user?.[ROLES_CLAIM] ?? [];
        if (roles.some(r => userRoles.includes(r))) return next();
        res.status(403).send('Forbidden: your role does not have permission for this action.');
    };
}

app.get('/me', requiresAuth(), (req, res) => {
    res.json({ user: req.oidc.user ?? null });
});

// Home — render EWB page with all posts for the members section
const read_posts_all_sql = `
    SELECT
        postId, title, content, author, category,
        DATE_FORMAT(createdAt, "%M %D, %Y") AS createdFormatted
    FROM posts
    ORDER BY createdAt DESC
`
app.get("/", (req, res) => {
    db.execute(read_posts_all_sql, (error, results) => {
        if (DEBUG) console.log(error ? error : results);
        if (error)
            res.status(500).send(error);
        else
            res.render('index', { posts: results });
    });
});

// Post detail page
const read_post_detail_sql = `
    SELECT
        postId, title, content, author, category,
        DATE_FORMAT(createdAt, "%W, %M %D %Y") AS createdFormatted
    FROM posts
    WHERE postId = ?
`
app.get("/posts/:id", requiresAuth(), (req, res) => {
    db.execute(read_post_detail_sql, [req.params.id], (error, results) => {
        if (DEBUG) console.log(error ? error : results);
        if (error)
            res.status(500).send(error);
        else if (results.length == 0)
            res.status(404).send(`No post found with id = "${req.params.id}"`);
        else
            res.render('post_detail', { post: results[0] });
    });
});

// Delete post
const delete_post_sql = `
    DELETE FROM posts WHERE postId = ?
`
app.get("/posts/:id/delete", requiresAuth(), hasRole('president'), (req, res) => {
    db.execute(delete_post_sql, [req.params.id], (error, results) => {
        if (DEBUG) console.log(error ? error : results);
        if (error)
            res.status(500).send(error);
        else
            res.redirect("/#members");
    });
});

// Create post
const create_post_sql = `
    INSERT INTO posts (title, content, author, category)
    VALUES (?, ?, ?, ?);
`
app.post("/posts", requiresAuth(), hasRole('leadership', 'president'), (req, res) => {
    db.execute(create_post_sql, [req.body.title, req.body.content, req.body.author, req.body.category], (error, results) => {
        if (DEBUG) console.log(error ? error : results);
        if (error)
            res.status(500).send(error);
        else
            res.redirect(`/posts/${results.insertId}`);
    });
});

// Update post
const update_post_sql = `
    UPDATE posts
    SET title = ?, content = ?, author = ?, category = ?
    WHERE postId = ?
`
app.post("/posts/:id", requiresAuth(), hasRole('leadership', 'president'), (req, res) => {
    db.execute(update_post_sql, [req.body.title, req.body.content, req.body.author, req.body.category, req.params.id], (error, results) => {
        if (DEBUG) console.log(error ? error : results);
        if (error)
            res.status(500).send(error);
        else
            res.redirect(`/posts/${req.params.id}`);
    });
});

app.listen(port, () => {
    console.log(`App server listening on ${port}. (Go to http://localhost:${port})`);
});
