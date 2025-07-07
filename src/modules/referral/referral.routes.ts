import { Router } from 'express';
import { claimReferral } from './referral.controller';
import { requireTelegramAuth } from '../../middlewares/requireAuth';

const router = Router();
router.post('/claim', requireTelegramAuth, claimReferral);
export default router;
