import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './modules/users/user.route';
import authRoutes from './modules/auth/auth.route';
import gameRoutes from './modules/game/game.route';
import tasksRoutes from './modules/tasks/tasks.route';
import checkinRoutes from './modules/checkin/checkin.route';
import referralRoutes from './modules/referral/referral.routes';


interface HealthResponse {
    status: string;
}

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check

app.get('/health', (_: Request, res: Response<HealthResponse>) => {
    res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/game', gameRoutes);
app.use('/tasks', tasksRoutes);
app.use('/checkin', checkinRoutes);
app.use('/referral', referralRoutes);

export default app;