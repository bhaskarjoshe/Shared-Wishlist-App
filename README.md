# Shared Wishlist App

A full-stack web application for managing shared wishlists, built with a React + Vite + Tailwind frontend and an Express + PostgreSQL backend.

---

## Project Structure

```
shared-wishlist-app/
  client/    # Frontend (React, Vite, TailwindCSS, TypeScript)
  server/    # Backend (Node.js, Express, PostgreSQL)
```

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **PostgreSQL** (for backend database)

---

## Backend Setup (`server/`)

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```
PORT=5000
DB_HOST=localhost
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

- `PORT`: Port for the backend server (default: 5000)
- `DB_*`: PostgreSQL connection details
- `JWT_SECRET`: Secret key for JWT authentication

### 3. Database Setup

- Create a PostgreSQL database and user matching your `.env` values.
- Ensure the following tables exist (simplified, adjust as needed):

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  added_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  imageurl TEXT,
  added_by INTEGER REFERENCES users(id),
  wishlist_id INTEGER REFERENCES wishlist(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Start the Backend Server

- For development (with auto-reload):

  ```bash
  npm run dev
  ```

- For production:

  ```bash
  npm start
  ```

The backend will run on `http://localhost:5000` by default.

---

## Frontend Setup (`client/`)

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Variables

Create a `.env` file in the `client/` directory with the following variable:

```
VITE_ROOT_API_URL=http://localhost:5000/api
```

- This should point to your backend API root.

### 3. Start the Frontend

- For development (hot reload):

  ```bash
  npm run dev
  ```

  The app will be available at `http://localhost:5173` (default Vite port).

- For production build:

  ```bash
  npm run build
  npm run preview
  ```

---

## Usage

- Register a new user and log in.
- Create wishlists and add products.
- All API requests are authenticated using JWT (token stored in localStorage after login).

---

## Scripts

### Backend (`server/`)

- `npm run dev` — Start server with nodemon (auto-reload)
- `npm start` — Start server with Node.js

### Frontend (`client/`)

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code

---

## Notes

- **CORS**: The backend is configured to allow requests from `http://localhost:5173` (the frontend dev server).
- **Logging**: Backend uses Winston for logging (logs stored in `server/logs/`).
- **Environment Variables**: Never commit your `.env` files to version control.

---

## Troubleshooting

- Ensure PostgreSQL is running and accessible with the credentials in your `.env`.
- If ports are in use, adjust `PORT` in backend `.env` and `VITE_ROOT_API_URL` in frontend `.env` accordingly.

---

