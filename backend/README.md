# Task Management REST API

A Node.js + Express REST API for managing tasks with JWT authentication.

## Tech Stack

- **Runtime**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend/` directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=5001
```

3. Start the server:
```bash
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/users/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
  ```

#### Login
- **POST** `/users/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
  ```

### Tasks (Protected - Requires JWT)

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Create Task
- **POST** `/tasks`
- **Body**:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the task management API",
    "priority": "High",
    "status": "In Progress"
  }
  ```
- **Note**: `description`, `priority`, and `status` are optional. Defaults: `priority: "Medium"`, `status: "Pending"`

#### Get All Tasks
- **GET** `/tasks`
- **Query Parameters**:
  - `status`: Filter by status (`Pending`, `In Progress`, `Done`)
  - `priority`: Filter by priority (`Low`, `Medium`, `High`)
  - `sortBy`: Sort field (`createdAt`, `priority`) - default: `createdAt`
  - `order`: Sort order (`asc`, `desc`) - default: `desc`
  - `page`: Page number - default: `1`
  - `limit`: Items per page - default: `10`
- **Example**: `/tasks?status=Pending&priority=High&sortBy=priority&order=asc&page=1&limit=10`
- **Response** (200):
  ```json
  {
    "total": 25,
    "page": 1,
    "limit": 10,
    "tasks": [...]
  }
  ```

#### Get Single Task
- **GET** `/tasks/:id`
- **Response** (200): Task object
- **Error** (404): Task not found

#### Update Task
- **PUT** `/tasks/:id`
- **Body** (all fields optional):
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "priority": "Low",
    "status": "Done"
  }
  ```
- **Response** (200): Updated task object
- **Error** (404): Task not found

#### Delete Task
- **DELETE** `/tasks/:id`
- **Response** (200):
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
- **Error** (404): Task not found

## Validation

### Register Validation
- `name`: Required, non-empty
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

### Login Validation
- `email`: Required, valid email format
- `password`: Required

### Task Validation
- `title`: Required (for create), non-empty (for update)
- `priority`: Optional, must be `Low`, `Medium`, or `High`
- `status`: Optional, must be `Pending`, `In Progress`, or `Done`

Validation errors return status 400 with:
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "fieldName",
      ...
    }
  ]
}
```

## Error Responses

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token, invalid credentials)
- **404**: Not Found (task not found or doesn't belong to user)
- **409**: Conflict (user already exists)
- **500**: Internal Server Error


