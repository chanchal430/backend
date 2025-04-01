import { Router } from 'express';
import { saveTelegramId, updateUser, getUser } from '../components/Auth/controllers/user.controller';
import { updateTapPoints, saveGamePoints } from '../components/Auth/controllers/game.controller';
import { getQuestions } from '../components/Auth/controllers/quiz.controller';
import { invite } from '../components/Auth/controllers/invite.controller';
import { tasks, completeTask } from '../components/Auth/controllers/task.controller';

const router = Router();

router.post('/saveTelegramId', saveTelegramId);
router.post('/updateUser', updateUser);
router.post('/getUser', getUser);
router.post('/updateTapPoints', updateTapPoints);
router.post('/saveGamePoints', saveGamePoints);
router.post('/getQuestions', getQuestions);
router.post('/invite', invite);
router.post('/tasks', tasks);
router.post('/completeTask', completeTask);

export default router;
