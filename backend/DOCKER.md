# Docker Setup Guide

This guide explains how to run the Task Management API using Docker. Docker packages everything your app needs into containers, so it works the same way on any machine.

## What is Docker?

Docker creates containers that include your application and all its dependencies. Think of it like a shipping container - everything inside works the same way, whether it's on a ship, truck, or train.

**Benefits:**
- Works the same on your laptop, teammate's laptop, or a server
- No need to install Node.js or MongoDB separately
- One command starts everything
- Isolated from other apps on your machine

## Prerequisites

Before using Docker, you need to install Docker Desktop:

**For Mac:**
1. Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Download Docker Desktop for Mac
3. Install and open Docker Desktop
4. Wait for Docker to start (you'll see a whale icon in your menu bar)

**For Windows:**
1. Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Download Docker Desktop for Windows
3. Install and restart your computer
4. Open Docker Desktop

**For Linux:**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

**Verify Installation:**
```bash
docker --version
```

## Docker Files Explained

### 1. Dockerfile

This file tells Docker how to build your application container.

**What it does:**
- Starts with Node.js 18 (Alpine version = smaller size)
- Sets up working directory
- Copies package files and installs dependencies
- Copies your code
- Exposes port 5001
- Runs your application

### 2. .dockerignore

This file tells Docker which files to skip (like `.gitignore`).

**Excludes:**
- `node_modules` (will be installed fresh in container)
- `.env` (use environment variables in docker-compose.yml instead)
- Test files, git files, etc.

### 3. docker-compose.yml

This file defines how to run your app and MongoDB together.

**What it does:**
- Starts a MongoDB container
- Starts your backend container
- Connects them together
- Sets up networking between containers
- Configures environment variables

## Quick Start

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Start Everything

**New Docker versions (recommended):**
```bash
docker compose up
```

**Older Docker versions:**
```bash
docker-compose up
```

### Step 3: Wait for Startup

You'll see logs showing:
1. MongoDB starting
2. Your app building
3. Database connection
4. "Server running on port 5001"

### Step 4: Test Your API

Open Postman and test:
```
POST http://localhost:5001/users/register
```

That's it! Your API is running.

## Common Commands

### Start Containers

**Foreground (see logs):**
```bash
docker compose up
```

**Background (detached mode):**
```bash
docker compose up -d
```

### Stop Containers

```bash
docker compose down
```

This stops and removes containers but keeps your MongoDB data.

### View Logs

**All services:**
```bash
docker compose logs -f
```

**Just backend:**
```bash
docker compose logs -f backend
```

**Just MongoDB:**
```bash
docker compose logs -f mongodb
```

### Rebuild After Code Changes

If you change your code, rebuild the image:

```bash
docker compose up --build
```

### Stop and Remove Everything

**Stop containers and remove volumes (deletes data):**
```bash
docker compose down -v
```

## Configuration

### Environment Variables

Edit `docker-compose.yml` to change settings:

```yaml
environment:
  - PORT=5001
  - MONGODB_URI=mongodb://admin:password123@mongodb:27017/taskmanager?authSource=admin
  - JWT_SECRET=your_jwt_secret_key_change_this
  - JWT_EXPIRES_IN=7d
```

**Important:** Change `JWT_SECRET` to a long random string for security.

### Change Ports

If port 5001 is already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "5002:5001"  # Use 5002 on your machine, 5001 in container
```

### MongoDB Credentials

Default MongoDB credentials in `docker-compose.yml`:
- Username: `admin`
- Password: `password123`

**Change these for production!**

## How It Works

When you run `docker compose up`, here's what happens:

1. **Docker reads docker-compose.yml**
   - Sees you need MongoDB and backend services

2. **Downloads MongoDB image** (first time only)
   - Gets the official MongoDB image from Docker Hub

3. **Starts MongoDB container**
   - Runs MongoDB on port 27017
   - Creates data volume for persistence

4. **Builds your app image**
   - Reads Dockerfile
   - Installs Node.js dependencies
   - Copies your code

5. **Starts backend container**
   - Runs your Node.js app
   - Connects to MongoDB
   - Exposes port 5001

6. **Everything is connected**
   - Backend can talk to MongoDB
   - Your API is ready to use

## Development vs Production

### Development

For development with code changes:

```bash
# Rebuild after changes
docker compose up --build
```

Or use the dev Dockerfile:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production

For production deployment:

```bash
# Run in background
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

## Troubleshooting

### "Command not found: docker-compose"

**Solution:** Use `docker compose` (without hyphen) for newer Docker versions.

```bash
docker compose up
```

### Port Already in Use

**Error:** `port 5001 is already allocated`

**Solution:** Change the port in `docker-compose.yml`:
```yaml
ports:
  - "5002:5001"  # Use different port
```

### MongoDB Connection Error

**Error:** `MongoServerError: Authentication failed`

**Solutions:**
1. Wait a few seconds for MongoDB to fully start
2. Check MongoDB credentials in `docker-compose.yml`
3. Verify MONGODB_URI format is correct

### Code Changes Not Reflected

**Problem:** Changes to code don't show up

**Solution:** Rebuild the image
```bash
docker compose up --build
```

### Container Won't Start

**Check logs:**
```bash
docker compose logs
```

**Check if containers are running:**
```bash
docker ps
```

**Restart everything:**
```bash
docker compose down
docker compose up
```

## Manual Docker Commands (Alternative)

If you prefer not to use docker-compose:

### Build Image
```bash
docker build -t taskmanager-api .
```

### Run Container
```bash
docker run -p 5001:5001 \
  -e MONGODB_URI=mongodb://localhost:27017/taskmanager \
  -e JWT_SECRET=your_secret_key \
  -e JWT_EXPIRES_IN=7d \
  -e PORT=5001 \
  taskmanager-api
```

**Note:** This only runs your app. You'd need to run MongoDB separately.

## Data Persistence

MongoDB data is stored in a Docker volume called `mongodb_data`. This means:

- ✅ Data persists when you stop containers
- ✅ Data persists when you restart Docker
- ❌ Data is deleted if you run `docker compose down -v`

**To backup data:**
```bash
docker compose exec mongodb mongodump --out /data/backup
```

## Clean Up

### Remove Everything

**Stop and remove containers, networks, and volumes:**
```bash
docker compose down -v
```

**Remove images:**
```bash
docker rmi taskmanager_backend
docker rmi mongo:7
```

**Clean up unused Docker resources:**
```bash
docker system prune -a
```

**Warning:** This removes all unused Docker resources, not just from this project.

## What Gets Created

When you run `docker compose up`, Docker creates:

1. **Network:** `taskmanager_network` - Connects containers
2. **Volume:** `mongodb_data` - Stores MongoDB data
3. **Containers:**
   - `taskmanager_mongodb` - MongoDB database
   - `taskmanager_backend` - Your API

## Summary

**To run with Docker:**
1. Install Docker Desktop
2. Run `docker compose up`
3. Your API is ready at `http://localhost:5001`

**Benefits:**
- No need to install Node.js or MongoDB
- Works the same everywhere
- Easy to start and stop
- Isolated from your system

**Files:**
- `Dockerfile` - How to build your app
- `.dockerignore` - What to exclude
- `docker-compose.yml` - How to run everything together

That's all you need to know to use Docker with this project!
