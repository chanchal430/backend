import { IQuizService } from "../interface";
import AuthValidation from '../validation'
import * as path from 'path';
import * as fs from 'fs';
import UserModel from '../../../config/models/user.model'
import { getToday, readJSON } from "../../../utils";

const QuizService: IQuizService = {

  async getQuestions(body, user, host) {
    const { error } = AuthValidation.getQuestions(body);
    if (error) throw new Error(error.message);

    const today = getToday();
    const filePath = path.join(__dirname, '../../../assets/data/questions.json');
    if (!fs.existsSync(filePath)) return 0;

    const questions = readJSON(filePath).map((q: any, idx: number) => {
      const gameId = idx + 1;
      const playedToday = user.gameHistory?.some((g: any) => g.gameId === gameId && g.date === today);
      return {
        ...q,
        images: q.images.map((img: string) => `https://${host}/assets/images/${img}`),
        played: playedToday,
      };
    });

    return { success: true, questions };
  },
}

export default QuizService;
