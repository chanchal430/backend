import gameService from './game.service';
import taskService from './task.service';
import userService from './user.service';
import quizService from './quiz.service';
import inviteService from './invite.service';

const AuthService = {
    ...userService,
    ...gameService,
    ...inviteService,
    ...quizService,
    ...taskService,
};

export default AuthService;
