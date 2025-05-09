import * as path from 'path';
import { IGameService } from '../interface';
import AuthValidation from '../validation';
import { getToday, readJSON } from '../../../utils';

const GameService: IGameService = {

    async saveGamePoints(body: { gameId: number, gamePoints: number }, user) {
        const { error, value } = AuthValidation.saveGamePoints({
            gameId: body.gameId,
            gameCoins: body.gamePoints,
        });
        if (error) throw new Error(error.message);

        const { gameId, gameCoins } = value;
        const games = readJSON(path.join(__dirname, '../../../../assets/data/questions.json'));
        if (!games.find((g: any) => g.id === gameId)) return 0;

        const today = getToday();
        const lastResetDate = new Date(user.lastResetDate).toISOString().split('T')[0];
        if (!user.lastResetDate || lastResetDate !== today) {
            user.gameHistory = [];
            user.lastResetDate = Date.now();
        }

        if (user.gameHistory.some((entry: any) => entry.gameId === gameId && entry.date === today)) return 0;

        user.gameHistory.push({ gameId, date: today, played: true });
        user.gamePoints += gameCoins;
        user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;
        await user.save();

        return 1;
    },

    async updateTapPoints(body, user) {
        const { error, value } = AuthValidation.updateTapPoints({
            points: body.tapPoints,
        });
        if (error) throw new Error(error.message);

        const MAX_TAP_POINTS = 20;
        const TAP_RESET_HOURS = 24;
        const now = Date.now();
        const lastTap = user.lastTapTimestamp || 0;
        const hoursSinceLastTap = (now - lastTap) / (1000 * 60 * 60);

        if (hoursSinceLastTap >= TAP_RESET_HOURS) {
            user.tapPoints = 0;
            user.lastTapTimestamp = now;
        }

        if (user.tapPoints + value.points > MAX_TAP_POINTS) {
            throw new Error(`Daily limit of ${MAX_TAP_POINTS} tap points reached. Try again in ${Math.ceil(TAP_RESET_HOURS - hoursSinceLastTap)} hrs.`);
        }

        user.tapPoints += value.points;
        user.totalPoints = user.taskPoints + user.tapPoints + user.gamePoints;
        user.lastTapTimestamp = now;
        await user.save();

        return 1;
    },

};

export default GameService;
