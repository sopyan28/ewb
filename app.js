const DEBUG = true;

const express = require("express");
const logger = require("morgan");
const db = require('./db/db_connection');
const app = express();
const port = 3000;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

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
app.get("/posts/:id", (req, res) => {
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
app.get("/posts/:id/delete", (req, res) => {
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
app.post("/posts", (req, res) => {
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
app.post("/posts/:id", (req, res) => {
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
