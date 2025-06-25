import { Router } from 'express';
import { getTasks, completeTask, createTask } from './tasks.controller';
import { requireAdmin } from '../../middlewares/requireAdmin.middleware';
import { requirePrivyAuth } from '../../middlewares/requirePrivyAuth';

const router = Router();

router.get('/', requirePrivyAuth, getTasks);                         
router.post('/', requirePrivyAuth, requireAdmin, createTask);        
router.post('/:id/complete', requirePrivyAuth, completeTask);        

export default router;
