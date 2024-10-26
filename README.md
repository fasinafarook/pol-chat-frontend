poll-app

```markdown
# Poll App

A poll application where users can create, vote, and view polls. The project is built using **React** with **TypeScript** and styled with **Tailwind CSS**. The backend is hosted on **Render**, and the frontend on **Vercel**.

## Table of Contents
- [Features](#features)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Acknowledgments](#acknowledgments)

---

## Features
- User registration and login (JWT authentication)
- Create, view, and vote on polls
- Real-time chat functionality using Socket.io
- Responsive UI with Tailwind CSS
- User poll management dashboard

## Live Demo
Access the live application [here](https://poll-app-wheat-five.vercel.app/).

## Installation

### Prerequisites
- **Node.js** and **npm** installed
- An account on **Render** (for backend) and **Vercel** (for frontend deployment)

### Clone Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/fasinafarook/pol-chat-frontend.git
cd poll-app
```

---

## Backend Setup
The backend is hosted on Render at `https://poll-app-ci3g.onrender.com`.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Set up your backend environment variables in `.env`:
   ```dotenv
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Run the backend server:
   ```bash
   npm start
   ```
   Your backend server should now be running on `http://localhost:5000`.

---

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Set up your frontend environment variables in `.env.local`:
   ```dotenv
   REACT_APP_API_URL=https://poll-app-ci3g.onrender.com/api
   ```

4. Start the frontend server:
   ```bash
   npm start
   ```
   Your frontend server should now be running on `http://localhost:3000`.

---

## Environment Variables

### Backend
Add the following environment variables in the `backend/.env` file:
```dotenv
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend
Add the following environment variable in the `frontend/.env.local` file:
```dotenv
REACT_APP_API_URL=https://poll-app-ci3g.onrender.com/api
```

---

## Usage
1. Open the frontend app at `http://localhost:3000`.
2. Register or login to access the poll functionalities.
3. Navigate to different sections (create polls, view all polls, vote, and chat).

---

## Scripts

### Backend
- **`npm start`**: Start the server.
- **`npm run dev`**: Start the server in development mode with hot reloading.

### Frontend
- **`npm start`**: Start the development server.
- **`npm build`**: Create an optimized production build.
- **`npm test`**: Run tests.

---

## Folder Structure

```
poll-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.tsx
│   └── .env.local
└── README.md
```

---

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Render (backend), Vercel (frontend)

---

## Acknowledgments
Thank you for using the Poll App! If you have any questions, feel free to open an issue or reach out.
```

This README should help guide users through both setting up and understanding the application’s structure, usage, and technologies used. Adjust details as necessary for your specific deployment settings and project updates.
