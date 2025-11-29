import express from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createTaskValidation, updateTaskValidation } from '../validators/taskValidators.js';

const router = express.Router();

router.use(protect);

router.post('/', createTaskValidation, createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', deleteTask);

export default router;


