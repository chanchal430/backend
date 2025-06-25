import { Router } from 'express';
import { checkin } from './checkin.controller';
import { requirePrivyAuth } from '../../middlewares/requirePrivyAuth';

const router = Router();
router.post('/', requirePrivyAuth, checkin);
export default router;