const db = require("./db_connection");

/**** Drop existing tables, if any ****/

const drop_posts_table_sql = "DROP TABLE IF EXISTS posts;"

db.execute(drop_posts_table_sql);

/**** Create tables ****/

const create_posts_table_sql = `
    CREATE TABLE posts (
        postId    INT NOT NULL AUTO_INCREMENT,
        title     VARCHAR(100) NOT NULL,
        content   VARCHAR(1000) NULL,
        author    VARCHAR(60) NOT NULL,
        category  VARCHAR(45) NOT NULL DEFAULT 'Announcement',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (postId));
`

db.execute(create_posts_table_sql);

db.end();
