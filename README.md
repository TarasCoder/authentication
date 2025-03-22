# Full Stack Authentication Project

This project is a full-stack application designed to practice authentication using Node.js, Express, PostgreSQL, and React.

## Features
- User registration with hashed passwords
- User login with session management
- Secure storage of user secrets
- API endpoints for authentication and session validation

## Database Setup
Create a table in PostgreSQL with the following schema:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    uuid TEXT UNIQUE,
    uuid_exp TIMESTAMP WITHOUT TIME ZONE,
    secret TEXT
);
```

## Environment Variables
Create 2 `.env` file with the following variables:
```
BACKEND:
APP_PORT=5000
DB_USER_NAME=your_db_user
DB_HOST=your_db_host
DB_DATABASE_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
SALT_ROUNDS=10

FRONTEND with endpoints:
VITE_URL_TO_REGISTER="http://localhost:3000/register"
VITE_URL_TO_LOGIN="http://localhost:3000/login"
VITE_URL_TO_SECRETS="http://localhost:3000/secrets"
VITE_URL_TO_VALIDATE_SESSION="http://localhost:3000/validate_session"
VITE_URL_TO_ADD_SECRET="http://localhost:3000/add_secret"
```

## Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/authentication-practice.git
   cd authentication-practice
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node --watch server
   ```

## Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- bcrypt for password hashing
- UUID for session management
- React (Frontend)

## License
This project is licensed under the MIT License.
