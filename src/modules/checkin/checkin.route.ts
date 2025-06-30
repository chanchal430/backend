import { Router } from 'express';
import { checkin } from './checkin.controller';
import { requireTelegramAuth } from '../../middlewares/requireAuth';

const router = Router();
router.post('/', requireTelegramAuth, checkin);
export default router;