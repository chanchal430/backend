import { Router } from 'express';
import { telegramLogin } from './auth.controller';

const router = Router();

router.post('/login', telegramLogin);

export default router;