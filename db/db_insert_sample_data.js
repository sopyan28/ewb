const db = require("./db_connection");

/**** Delete contents of existing table ****/

const delete_posts_sql = "DELETE FROM posts;"

db.execute(delete_posts_sql);

/**** Insert sample posts ****/

const insert_post_sql = `
    INSERT INTO posts (title, content, author, category)
    VALUES (?, ?, ?, ?);
`

db.execute(insert_post_sql, [
    'Welcome to EWB 2024–2025!',
    "We're thrilled to kick off another amazing year. Our first general meeting is coming up soon — look out for details on our Instagram. We can't wait to connect with all of our members and get started on this year's initiatives!",
    'Sofia Chen',
    'Announcement'
]);

db.execute(insert_post_sql, [
    'Spring Conference Registration Now Open',
    "Registration for EWB's annual spring conference is officially open! Spots are limited so sign up as soon as possible. This year's theme is \"Lead with Purpose\" — featuring guest speakers from finance, entrepreneurship, and marketing. More details to follow.",
    'Maya Patel',
    'Event'
]);

db.execute(insert_post_sql, [
    'Fall Networking Night Recap',
    "What an incredible evening! Thank you to everyone who joined us for our fall networking event. We had over 40 attendees and heard from three amazing guest speakers who shared their journeys in business leadership. Photos are posted on our Instagram @ewb.bca.",
    'Leila Ramos',
    'Recap'
]);

db.end();
