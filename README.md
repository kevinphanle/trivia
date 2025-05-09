# Quiz Application

A full-stack quiz application built with React, TypeScript, Node.js, and MongoDB. The application allows users to take quizzes on various categories with different difficulty levels.

## Features

- 🎯 Multiple quiz categories
- ⚡ Real-time feedback on answers
- 📈 Score tracking
- 🎨 Modern and responsive UI
- 🔒 Type-safe with TypeScript
- 📱 Mobile-friendly design

## Tech Stack

### Frontend

- React 18
- TypeScript
- Redux Toolkit for state management
- Axios for API calls
- Jest & React Testing Library for testing
- CSS Modules for styling

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Jest for testing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd quiz-app
```

2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/quiz-app
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Project Structure

```
quiz-app/
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   └── tests/             # Backend tests
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── features/       # Redux slices
    │   ├── app/           # Redux store
    │   ├── types/         # TypeScript types
    │   └── utils/         # Utility functions
    └── tests/             # Frontend tests
```

## API Endpoints

### Categories

- `GET /api/categories` - Get all quiz categories

### Quiz

- `GET /api/quiz` - Get quiz questions
  - Query Parameters:
    - `category`: Category ID
    - `difficulty`: Difficulty level (easy/medium/hard)
    - `amount`: Number of questions

## Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for the quiz questions
- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
