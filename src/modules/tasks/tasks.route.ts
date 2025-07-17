import { Router } from 'express';
import { getTasks, completeTask, createTask } from './tasks.controller';
import { requireAdmin } from '../../middlewares/requireAdmin.middleware';
// import { requirePrivyAuth } from '../../middlewares/requirePrivyAuth';
import { requireTelegramAuth } from '../../middlewares/requireAuth';

const router = Router();

// Get all tasks
router.get('/', requireTelegramAuth, getTasks);

// Create a new task (admin only)
router.post('/', requireTelegramAuth, requireAdmin, createTask);

// Complete a task by ID
router.post('/:id/complete', requireTelegramAuth, completeTask);

export default router;
