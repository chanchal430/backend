import { Router } from 'express';
import { saveTelegramId, updateUser, getUser } from '../components/Auth/controllers/user.controller';
import { updateTapPoints, saveGamePoints } from '../components/Auth/controllers/game.controller';
import { getQuestions } from '../components/Auth/controllers/quiz.controller';
import { invite } from '../components/Auth/controllers/invite.controller';
import { tasks, completeTask } from '../components/Auth/controllers/task.controller';
import { isAuthenticated } from '../config/middleware/jwtAuth';

/**
 * Dont use any types
 * Protected routes with auth
 */
const router = Router();

router.post('/saveTelegramId', saveTelegramId);

// Protected routes
router.post('/updateUser', isAuthenticated, updateUser);
router.post('/getUser', isAuthenticated, getUser);
router.post('/updateTapPoints', isAuthenticated, updateTapPoints);
router.post('/saveGamePoints', isAuthenticated, saveGamePoints);
router.post('/getQuestions', isAuthenticated, getQuestions);
router.post('/invite', isAuthenticated, invite);
router.post('/tasks', isAuthenticated, tasks);
router.post('/completeTask', isAuthenticated, completeTask);

export default router;
