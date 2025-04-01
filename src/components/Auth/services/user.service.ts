import UserModel from "../../../config/models/user.model";
import { IUserService} from "../interface";
import AuthValidation from '../validation'

const UserService: IUserService = {

    async saveTelegramId(body) {
        const { error, value } = AuthValidation.saveTelegramId(body);
        if (error) throw new Error(error.message);

        let user = await UserModel.findOne({ telegramUserId: value.telegramUserId });
        if (!user) {
            user = new UserModel({
                telegramUserId: value.telegramUserId,
                firstName: '', lastName: '', taskPoints: 0, tapPoints: 0, gamePoints: 0, totalPoints: 0,
            });
            await user.save();
        }
        return 1;
    },

    async updateUser(body, user) {
        const { error, value } = AuthValidation.updateUser(body);
        if (error) throw new Error(error.message);

        const update: any = {};
        if (value.firstName) update.firstName = value.firstName;
        if (value.lastName) update.lastName = value.lastName;

        if (value.email) {
            const existing = await UserModel.findOne({ email: value.email });
            if (existing && existing.telegramUserId !== user.telegramUserId) return 2;
            update.email = value.email;
        }

        const updated = await UserModel.findOneAndUpdate(
            { telegramUserId: user.telegramUserId },
            update,
            { new: true }
        );
        return updated ? 1 : 0;
    },

    async user(_, usr) {
        const user = await UserModel.findOne({ telegramUserId: usr.telegramUserId })
            .select(['firstName', 'lastName', 'email', 'taskPoints', 'tapPoints', 'totalPoints', '-_id']);
        return { success: true, user };
    },
}

export default UserService;
