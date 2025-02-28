# Book Keeper API

A RESTful API for managing books built with Express.js, TypeScript, and Prisma.

## Features

- CRUD operations for books
- Input validation using Zod
- Error handling middleware
- SQLite database with Prisma ORM
- API documentation with Swagger
- Comprehensive test coverage
- TypeScript for type safety

## Project Structure

src/
├── api/books/
├── database/
├── middleware/
├── swagger/
├── utils/
├── app.ts
└── server.ts

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
NODE_ENV="development"
```

## API Endpoints

- GET /api/books
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id

## Scripts

- `npm run dev`: Development server
- `npm run build`: Build project
- `npm start`: Production server
- `npm test`: Run tests
- `npm run test:coverage`: Test coverage
