import { Router } from 'express';
import { claimReferral } from './referral.controller';
import { requirePrivyAuth } from '../../middlewares/requirePrivyAuth';

const router = Router();
router.post('/claim', requirePrivyAuth, claimReferral);
export default router;
