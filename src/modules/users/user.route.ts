import { Router } from 'express';
import { getMe, saveTelegramUser } from './user.controller';
import { requireTelegramAuth } from '../../middlewares/requireAuth';

const router = Router();

router.post('/', requireTelegramAuth, saveTelegramUser);
router.get('/me', requireTelegramAuth, getMe);

export default router;
