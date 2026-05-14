# EWB — Empowering Women in Business

A full-stack web app for the EWB club at Bergen County Academies. Members can view, create, edit, and delete posts and announcements through a password-protected portal.

## Tech Stack

- **Backend:** Node.js, Express
- **Templating:** EJS
- **Database:** MySQL (via mysql2)
- **Frontend:** Custom CSS (purple EWB design system)

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your database credentials:
   ```
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   ```

3. Set up the database:
   ```bash
   npm run dbcreate
   npm run dbsample
   ```

4. Start the server:
   ```bash
   npm run devstart
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|---|---|
| `GET /` | Main EWB site (Home, About, Gallery, Resources, Conference, Members, Meet the Team) |
| `GET /posts/:id` | Post detail + edit form |
| `POST /posts` | Create a new post |
| `POST /posts/:id` | Update a post |
| `GET /posts/:id/delete` | Delete a post |

## Members Area

The Members tab is password-protected (client-side). Members can post announcements, event recaps, and more.
