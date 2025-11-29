# Task Management REST API

A complete backend API for managing tasks with user authentication. Built with Node.js, Express, and MongoDB.

## What This Project Does

This is a REST API that lets users:
- Register and login with JWT authentication
- Create, read, update, and delete their tasks
- Filter and sort tasks by status and priority
- Paginate through their task list

Each user can only see and manage their own tasks. All task endpoints are protected and require a valid JWT token.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database (using Mongoose ODM)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Register & login logic
│   └── taskController.js  # Task CRUD operations
├── middleware/
│   └── authMiddleware.js  # JWT authentication check
├── models/
│   ├── User.js            # User schema
│   └── Task.js           # Task schema
├── routes/
│   ├── authRoutes.js     # Auth endpoints
│   └── taskRoutes.js     # Task endpoints
├── utils/
│   └── generateToken.js  # JWT token generation
├── validators/
│   ├── authValidators.js # Auth validation rules
│   └── taskValidators.js # Task validation rules
├── tests/
│   ├── auth.test.js      # Auth route tests
│   ├── app.js            # Test app setup
│   └── setup.js          # Test database setup
├── index.js              # Server entry point
└── package.json          # Dependencies
```

## Setup Instructions

### Step 1: Install Node.js

Make sure you have Node.js installed (version 16 or higher).

Check if you have it:
```bash
node --version
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Install Dependencies

Navigate to the backend folder and install packages:

```bash
cd backend
npm install
```

This installs all required packages like Express, Mongoose, JWT, etc.

### Step 3: Setup MongoDB

You have two options:

**Option A: Local MongoDB**
- Install MongoDB on your machine
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/taskmanager`

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create free account
- Create a free cluster
- Get your connection string
- Use that connection string in `.env`

### Step 4: Create Environment File

Create a file named `.env` in the `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager

JWT_SECRET=your_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
PORT=5001
```

**Important:** 
- Replace `your_secret_key_here_make_it_long_and_random` with a long random string
- Use your actual MongoDB connection string
- Never commit `.env` file to Git (it's in `.gitignore`)

### Step 5: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
MongoDB Connected: ...
Server running on port 5001
```

Your API is now running at `http://localhost:5001`

## Running Tests

This project includes unit tests for authentication routes using Jest.

**Run all tests:**
```bash
npm test
```

**What the tests cover:**
- User registration (success and validation errors)
- User login (success and invalid credentials)
- Password hashing verification
- Input validation checks

The tests use a separate test database (`taskmanager_test`) so your real data stays safe.

## Live API

The API is deployed and live at:

**🌐 Live URL:** https://kumudu.onrender.com

You can test all endpoints using this URL instead of `localhost:5001`.

**Example:**
```
POST https://kumudu.onrender.com/users/register
GET https://kumudu.onrender.com/tasks
```

**Note:** The first request after inactivity may take a few seconds as Render spins up the service (free tier limitation).

## API Endpoints

### Base URL

**Local Development:**
```
http://localhost:5001
```

**Production (Live):**
```
https://kumudu.onrender.com
```

### Authentication Endpoints

#### Register New User
```
POST /users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "692a834985e4f4bf4a5faa33",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Validation errors (missing fields, invalid email, short password)
- `409` - User already exists with this email

#### Login
```
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "692a834985e4f4bf4a5faa33",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Validation errors
- `401` - Invalid email or password

**Important:** Save the `token` from register/login response. You'll need it for all task endpoints.

### Task Endpoints (Protected)

All task endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

#### Create Task
```
POST /tasks
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task management API",
  "priority": "High",
  "status": "In Progress"
}
```

**Note:** 
- `title` is required
- `description`, `priority`, and `status` are optional
- Default `priority`: "Medium"
- Default `status`: "Pending"

**Success Response (201):**
Returns the created task object with `_id`, `userId`, `createdAt`, etc.

#### Get All Tasks
```
GET /tasks
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters (all optional):**
- `status` - Filter by status: `Pending`, `In Progress`, or `Done`
- `priority` - Filter by priority: `Low`, `Medium`, or `High`
- `sortBy` - Sort field: `createdAt` or `priority` (default: `createdAt`)
- `order` - Sort direction: `asc` or `desc` (default: `desc`)
- `page` - Page number (default: `1`)
- `limit` - Items per page (default: `10`)

**Examples:**
```
GET /tasks?status=Pending
GET /tasks?priority=High
GET /tasks?status=Pending&priority=High
GET /tasks?sortBy=priority&order=asc
GET /tasks?page=2&limit=5
GET /tasks?status=Pending&sortBy=priority&order=desc&page=1&limit=10
```

**Success Response (200):**
```json
{
  "total": 25,
  "page": 1,
  "limit": 10,
  "tasks": [
    {
      "_id": "...",
      "title": "Complete project",
      "description": "Finish the task management API",
      "priority": "High",
      "status": "In Progress",
      "userId": "...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    ...
  ]
}
```

#### Get Single Task
```
GET /tasks/:id
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
Returns the task object.

**Error Response:**
- `404` - Task not found or doesn't belong to you

#### Update Task
```
PUT /tasks/:id
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "Low",
  "status": "Done"
}
```

**Success Response (200):**
Returns the updated task object.

**Error Responses:**
- `400` - Validation errors (invalid priority/status values)
- `404` - Task not found or doesn't belong to you

#### Delete Task
```
DELETE /tasks/:id
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Response:**
- `404` - Task not found or doesn't belong to you

## Validation Rules

### Register
- `name` - Required, cannot be empty
- `email` - Required, must be valid email format
- `password` - Required, minimum 6 characters

### Login
- `email` - Required, must be valid email format
- `password` - Required

### Create Task
- `title` - Required
- `priority` - Optional, must be: `Low`, `Medium`, or `High`
- `status` - Optional, must be: `Pending`, `In Progress`, or `Done`

### Update Task
- All fields optional
- If provided, must follow same rules as create

## Error Responses

All errors return JSON with a message:

- **400 Bad Request** - Validation errors
  ```json
  {
    "errors": [
      {
        "msg": "Email is required",
        "param": "email"
      }
    ]
  }
  ```

- **401 Unauthorized** - Missing/invalid token or wrong credentials
  ```json
  {
    "message": "Not authorized, no token"
  }
  ```

- **404 Not Found** - Task not found or doesn't belong to user
  ```json
  {
    "message": "Task not found"
  }
  ```

- **409 Conflict** - User already exists
  ```json
  {
    "message": "User already exists with this email"
  }
  ```

- **500 Internal Server Error** - Server error
  ```json
  {
    "message": "Something went wrong!"
  }
  ```

## Testing in Postman

You can test the API using either:
- **Local:** `http://localhost:5001` (when running locally)
- **Live:** `https://kumudu.onrender.com` (deployed version)

### Step 1: Register a User
1. Create new request: `POST https://kumudu.onrender.com/users/register`
   (or `POST http://localhost:5001/users/register` for local)
2. Body → raw → JSON:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
3. Send request
4. Copy the `token` from response

### Step 2: Use Token for Tasks
1. Create new request: `GET https://kumudu.onrender.com/tasks`
   (or `GET http://localhost:5001/tasks` for local)
2. Go to **Authorization** tab
3. Type: **Bearer Token**
4. Paste your token
5. Send request

### Step 3: Test All Endpoints
- Create tasks with different priorities and statuses
- Test filtering: `?status=Pending&priority=High`
- Test sorting: `?sortBy=priority&order=asc`
- Test pagination: `?page=1&limit=5`

## Features Implemented

✅ User registration with password hashing  
✅ User login with JWT token generation  
✅ JWT authentication middleware  
✅ Task CRUD operations (Create, Read, Update, Delete)  
✅ Filter tasks by status and/or priority  
✅ Sort tasks by createdAt or priority  
✅ Pagination with page and limit  
✅ Input validation using express-validator  
✅ Proper HTTP status codes  
✅ Error handling  
✅ Unit tests with Jest  
✅ Modular code structure  
✅ ES6 modules throughout  

## What Was Built

This project implements a complete Task Management API backend with:

1. **Authentication System**
   - Secure password hashing with bcrypt
   - JWT token-based authentication
   - Protected routes that verify tokens

2. **Task Management**
   - Full CRUD operations
   - User-specific tasks (users can only see their own)
   - Flexible filtering and sorting
   - Pagination support

3. **Code Quality**
   - Clean, modular structure
   - Input validation
   - Error handling
   - Unit tests

4. **Developer Experience**
   - Clear project structure
   - Comprehensive documentation
   - Easy setup process

## Deployment

This API is deployed on **Render** and is live at:

**🔗 Live API:** https://kumudu.onrender.com

### How to Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up for free account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name:** taskmanager-api (or any name)
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `backend`

4. **Add Environment Variables**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your secret key
   - `JWT_EXPIRES_IN` - `7d`
   - `PORT` - `5001` (or leave empty, Render sets it automatically)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be live!

### Render Free Tier Notes

- Service may spin down after 15 minutes of inactivity
- First request after inactivity takes ~30 seconds (cold start)
- Free tier includes 750 hours/month
- Auto-deploys on git push (if enabled)

## Next Steps

- ✅ Deployed to Render (https://kumudu.onrender.com)
- Add more features (task categories, due dates, etc.)
- Add more tests
- Set up CI/CD pipeline

## License

ISC
