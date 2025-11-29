import request from 'supertest';
import { beforeAll, afterAll, beforeEach, describe, test, expect } from '@jest/globals';
import mongoose from 'mongoose';
import app from './app.js';
import User from '../models/User.js';
import { connectTestDB, disconnectTestDB, clearDatabase } from './setup.js';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /users/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', 'John Doe');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
      expect(response.body.user).not.toHaveProperty('password');

      const user = await User.findOne({ email: 'john@example.com' });
      expect(user).toBeTruthy();
      expect(user.password).not.toBe('password123');
    });

    test('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    test('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    test('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: '12345',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    test('should return 409 if user already exists', async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/users/register')
        .send({
          name: 'Jane Doe',
          email: 'john@example.com',
          password: 'password456',
        })
        .expect(409);

      expect(response.body).toHaveProperty('message', 'User already exists with this email');
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });

    test('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', 'John Doe');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    test('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    test('should return 401 if email is invalid', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    test('should return 401 if password is incorrect', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    test('should return 400 if email format is invalid', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});


