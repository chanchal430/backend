import { Router } from 'express';
import { tap } from './game.controller';
import { requireTelegramAuth } from '../../middlewares/requireAuth';

const router = Router();
router.post('/tap', requireTelegramAuth, tap);
export default router;
