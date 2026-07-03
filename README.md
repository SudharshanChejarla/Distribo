# Distribo - Distribution Operations Platform

A full-stack MERN application designed to simplify distribution operations for small businesses.

## Features

- User Registration & Login (JWT Authentication)
- Product Management
- Stock Management
- Sales Executive Management
- Dispatch Management
- Return Management
- Dashboard Analytics
- Reports
- User Profile

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```

Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Future Improvements

- Role-based authentication
- Invoice generation
- Excel export
- Email notifications

## Author

Sudharshan Chejarla