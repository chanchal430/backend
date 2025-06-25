import { Router } from 'express';
import { getMe, savePrivyUser } from './user.controller';
import { requirePrivyAuth } from '../../middlewares/requirePrivyAuth';

const router = Router();
router.post('/', requirePrivyAuth, savePrivyUser);
router.get('/me', requirePrivyAuth, getMe);
export default router;
