# Lost and Found Portal

A simple web-based Lost and Found system that allows users to report lost and found items, view item history, and manage items through separate admin and student views.  
Built as a full-stack learning project to understand backend APIs, authentication, and file uploads.

## Features
- Report lost and found items
- View item history
- Admin and student dashboards
- Image upload for items
- Basic authentication using JWT

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- File Uploads: Multer

## Project Structure
client/ → frontend pages and scripts
server/ → backend API, routes, middleware


## Local Setup

### Clone the repository
```bash
git clone https://github.com/BuggyPratiK/lost-and-found-portal.git
cd lost-and-found-portal
```
## Install backend dependencies
cd server
npm install

## Environmental variables
Create a .env file inside the server/ directory...use .env.example as reference .

## Start the backend server
npm start

## Frontend
Open client/index.html in a browser or use Live Server.

## NOTES
- The server/uploads/ directory is excluded from version control as it contains runtime user uploads.
- This project was developed earlier and pushed later for learning and portfolio purposes.

