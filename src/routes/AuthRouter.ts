import { Router } from 'express';
import { AuthComponent } from '../components';
import { isAuthenticated } from '../config/middleware/jwtAuth';

/**
 * @constant {express.Router}
 */
const router: Router = Router();



router.post('/save-telegram-id', AuthComponent.saveTelegramId);
router.post('/saveGamePoints', isAuthenticated, AuthComponent.saveGamePoints);
router.post('/invite',isAuthenticated ,AuthComponent.invite);
router.post('/completeTask', isAuthenticated,AuthComponent.completeTask);
router.post('/updateTapPoints', isAuthenticated, AuthComponent.updateTapPoints);


router.put('/updateUser', isAuthenticated, AuthComponent.updateUser);


router.get('/getQuestions', isAuthenticated, AuthComponent.getQuestions);
router.get('/user', isAuthenticated,AuthComponent.user);
router.get('/tasks',isAuthenticated ,AuthComponent.tasks);


/**
 * @export {express.Router}
 */
export default router;
