import { Router } from 'express';
import { tap } from './game.controller';
import { requirePrivyAuth } from '../../middlewares/requirePrivyAuth';

const router = Router();
router.post('/tap', requirePrivyAuth, tap);
export default router;
