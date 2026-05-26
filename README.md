# task-react-node-typescript

StudentFlow is a complete full-stack Student Management System built with React, TypeScript, Node.js, Express, and MongoDB Atlas. It includes JWT authentication, protected dashboard routes, responsive glassmorphism UI, CRUD operations, search/filtering, pagination, dark/light mode, and a required two-level AES encryption workflow.

## Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, React Router DOM, Axios, React Hook Form, React Hot Toast, Framer Motion, Lucide React, Context API.

Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, dotenv, cors, bcryptjs, crypto-js, jsonwebtoken, express-validator.

## Setup Instructions

```bash
npm run install:all
npm run dev
```

Frontend runs at `http://localhost:5173`.
Backend runs at `http://localhost:5000`.

You can also run each app separately:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Environment Setup

`client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_FRONTEND_SECRET_KEY=frontend_secret_key
```

`server/.env`

```env
PORT=5000
JWT_SECRET=super_jwt_secret
FRONTEND_SECRET_KEY=frontend_secret_key
BACKEND_SECRET_KEY=backend_secret_key
MONGO_URI=mongodb+srv://nehasontakke1880:neha1234@cluster0.vdjmf.mongodb.net/
```

Note: `FRONTEND_SECRET_KEY` is also present on the backend so the server can remove the browser encryption layer before applying its own encryption. For a real production deployment, rotate all sample secrets and database credentials.

## Encryption Workflow

Create/update flow:

1. React form validates student data with React Hook Form.
2. `client/src/utils/crypto.ts` encrypts the full request payload with AES using `VITE_FRONTEND_SECRET_KEY`.
3. Express receives `{ payload }`.
4. `server/src/utils/crypto.ts` decrypts the frontend AES layer so the server can validate fields, hash the password with bcrypt, and create an email hash for login lookup.
5. The backend removes the password from the display payload.
6. The backend re-encrypts the safe display payload with the frontend key.
7. The backend wraps that frontend cipher in a second AES layer using `BACKEND_SECRET_KEY`.
8. MongoDB stores the doubly encrypted payload plus bcrypt password hash and email HMAC.

Fetch flow:

1. Client calls `GET /api/students` with JWT.
2. Backend decrypts only the backend AES layer.
3. Backend returns the still-frontend-encrypted payload.
4. Frontend decrypts the final layer and displays the original student data.

## API Endpoints

`POST /api/register` - Create student from encrypted payload.

`POST /api/login` - Login with email/password and receive JWT.

`GET /api/students` - Protected student list.

`PUT /api/student/:id` - Protected student update.

`DELETE /api/student/:id` - Protected student delete.

`GET /api/health` - API health check.

## Folder Structure

```text
task-react-node-typescript/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |-- .env
|   |-- tailwind.config.js
|   |-- vite.config.ts
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- utils/
|   |   |-- app.ts
|   |   |-- server.ts
|   |-- .env
|   |-- tsconfig.json
|-- README.md
```

## Screenshots

Add screenshots after running locally:

- Landing page
- Login page
- Dashboard table
- Student create/edit modal
- Mobile sidebar

## Deployment Guide

Frontend:

1. Build with `npm run build --prefix client`.
2. Deploy `client/dist` to Vercel, Netlify, or any static host.
3. Set `VITE_API_URL` to your deployed API URL.
4. Set `VITE_FRONTEND_SECRET_KEY`.

Backend:

1. Build with `npm run build --prefix server`.
2. Deploy `server/dist` to Render, Railway, Fly.io, or a Node.js host.
3. Set `PORT`, `JWT_SECRET`, `FRONTEND_SECRET_KEY`, `BACKEND_SECRET_KEY`, and `MONGO_URI`.
4. Allow the frontend origin in `server/src/app.ts` CORS settings.

MongoDB:

1. Use MongoDB Atlas.
2. Add your deployment IP or `0.0.0.0/0` for development.
3. Create a database user with least privilege access.

## Production Notes

- Replace sample secrets before deploying.
- Never commit real production `.env` files.
- Use HTTPS so encrypted payloads and JWTs travel over TLS.
- The app stores passwords only as bcrypt hashes, never as display data.
- JWT-protected dashboard routes persist auth in `localStorage`.
