# ✦ Taskflow — Full-Stack Task Manager

A modern task management app with JWT authentication, built with React, Node.js, Express, and MongoDB.

---

## 📁 Folder Structure

```
taskmanager/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe
│   │   └── taskController.js  # CRUD for tasks
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protection
│   ├── models/
│   │   ├── User.js            # User schema (bcrypt password)
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   └── taskRoutes.js      # /api/tasks/*
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js  # Global auth state (React Context)
    │   ├── hooks/
    │   │   └── useTasks.js     # Task CRUD hook
    │   ├── pages/
    │   │   ├── Login.js        # Login page
    │   │   ├── Signup.js       # Register page
    │   │   └── Dashboard.js    # Main task dashboard
    │   ├── App.js              # Router + protected routes
    │   ├── App.css             # Design system + global styles
    │   └── index.js            # React entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 1. Clone / Download the project

```bash
cd taskmanager
```

---

### 2. Set up the Backend

```bash
cd backend

# Install dependencies
npm install

# Create your .env file from the example
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI: your MongoDB connection string
# - JWT_SECRET: any long random string
# - PORT: 5000 (default)
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend:
```bash
npm run dev    # Development (with auto-reload via nodemon)
# or
npm start      # Production
```

Server runs at: `http://localhost:5000`

Test it: `http://localhost:5000/api/health`

---

### 3. Set up the Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Optional: create .env for production API URL
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start the dev server
npm start
```

App runs at: `http://localhost:3000`

The `"proxy": "http://localhost:5000"` in package.json handles API calls in development automatically.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description           | Auth Required |
|--------|----------------------|-----------------------|---------------|
| POST   | /api/auth/register   | Create new account    | ❌            |
| POST   | /api/auth/login      | Login & get token     | ❌            |
| GET    | /api/auth/me         | Get current user      | ✅            |

### Tasks
| Method | Endpoint             | Description           | Auth Required |
|--------|----------------------|-----------------------|---------------|
| GET    | /api/tasks           | Get all user tasks    | ✅            |
| POST   | /api/tasks           | Create new task       | ✅            |
| PUT    | /api/tasks/:id       | Update task           | ✅            |
| DELETE | /api/tasks/:id       | Delete task           | ✅            |

---

## 🔐 How Authentication Works

1. User registers → password hashed with **bcrypt** → saved to MongoDB
2. User logs in → server verifies password → returns **JWT token**
3. Token stored in **localStorage** on the frontend
4. Every protected API request sends: `Authorization: Bearer <token>`
5. Backend middleware validates the token before processing the request

---

## 🚀 Production Deployment

### Backend (e.g., Render, Railway, Heroku)
1. Set environment variables in your hosting platform
2. Set `NODE_ENV=production`
3. Set `CLIENT_URL` to your frontend URL (for CORS)
4. Use MongoDB Atlas for the database

### Frontend (e.g., Vercel, Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Run `npm run build`
3. Deploy the `build/` folder

---

## 🛠 Tech Stack

| Layer       | Technology            |
|-------------|----------------------|
| Frontend    | React 18, React Router v6 |
| Styling     | Custom CSS (design system) |
| HTTP Client | Axios               |
| Backend     | Node.js + Express   |
| Database    | MongoDB + Mongoose  |
| Auth        | JWT + bcrypt        |
| Dev Tools   | nodemon             |
