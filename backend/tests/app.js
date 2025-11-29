import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/authRoutes.js';
import taskRoutes from '../routes/taskRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', authRoutes);
app.use('/tasks', taskRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;


