import * as path from 'path';
import * as fs from 'fs';
import { IQuizService } from '../interface';
import AuthValidation from '../validation';
import UserModel, { IUserModel } from '../../../config/models/user.model';
import { getToday, readJSON } from '../../../utils';

interface RawQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  images: string[];
}

interface ProcessedQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  images: string[];
  played: boolean;
}

interface GameHistoryEntry {
  gameId: number;
  date: string;
  played: boolean;
}

const QuizService: IQuizService = {
    async getQuestions(body, user, host) {
        const { error } = AuthValidation.getQuestions.params.validate(body);
        if (error) throw new Error(error.message);

        const today = getToday();
        const filePath = path.join(__dirname, '../../../assets/data/questions.json');

        if (!fs.existsSync(filePath)) {
            return { success: false };
        }

        const rawQuestions: RawQuestion[] = readJSON(filePath);
        const processedQuestions: ProcessedQuestion[] = rawQuestions.map((q: RawQuestion, idx: number) => {
            const gameId = idx + 1;
            const playedToday = user.gameHistory?.some((g: GameHistoryEntry) => g.gameId === gameId && g.date === today) || false;

            return {
                id: gameId.toString(),
                text: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                images: q.images.map((img) => `https://${host}/assets/images/${img}`),
                played: playedToday,
            };
        });

        return {
            success: true,
            questions: processedQuestions,
        };
    },
};

export default QuizService;
