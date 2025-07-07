import { Router } from 'express';
import { getTasks, completeTask, createTask } from './tasks.controller';
import { requireAdmin } from '../../middlewares/requireAdmin.middleware';
// import { requirePrivyAuth } from '../../middlewares/requirePrivyAuth';
import { requireTelegramAuth } from '../../middlewares/requireAuth';

const router = Router();

router.get('/', requireTelegramAuth, getTasks);                         
router.post('/', requireTelegramAuth, requireAdmin, createTask);        
router.post('/:id/complete', requireTelegramAuth, completeTask);        

export default router;
