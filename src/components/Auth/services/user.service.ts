import UserModel, { IUserModel } from '../../../config/models/user.model';
import { IUserService } from '../interface';
import AuthValidation from '../validation';

interface TelegramRequest {
    telegramUserId: string;
}

interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
}

const UserService: IUserService = {

    async saveTelegramId(body: TelegramRequest): Promise<IUserModel> {
        const { error, value } = AuthValidation.saveTelegramId(body);
        if (error) throw new Error(error.message);

        let user = await UserModel.findOne({ telegramUserId: value.telegramUserId });
        if (!user) {
            user = new UserModel({
                telegramUserId: value.telegramUserId,
                firstName: '',
                lastName: '',
                taskPoints: 0,
                tapPoints: 0,
                gamePoints: 0,
                totalPoints: 0,
            });
            await user.save();
        }

        return user;
    },

    async updateUser(
        body: UpdateUserRequest,
        user: Pick<IUserModel, 'telegramUserId'>
    ): Promise<IUserModel | null> {
        const { error, value } = AuthValidation.updateUser(body);
        if (error) throw new Error(error.message);

        const update: Partial<IUserModel> = {};
        if (value.firstName) update.firstName = value.firstName;
        if (value.lastName) update.lastName = value.lastName;

        if (value.email) {
            const existing = await UserModel.findOne({ email: value.email });
            if (existing && existing.telegramUserId !== user.telegramUserId) {
                // You can throw a specific error or return null
                throw new Error('Email already in use by another account');
            }
            update.email = value.email;
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { telegramUserId: user.telegramUserId },
            update,
            { new: true }
        );

        return updatedUser;
    },

    async user(_: unknown, usr: Pick<IUserModel, 'telegramUserId'>): Promise<{ success: boolean; user: Partial<IUserModel> | null }> {
        const user = await UserModel.findOne({ telegramUserId: usr.telegramUserId }).select(
            'firstName lastName email taskPoints tapPoints totalPoints -_id',
        );

        return { success: !!user, user };
    },
};

export default UserService;
