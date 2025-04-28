import { IInviteService } from "../interface";
import UserModel, { IUserModel } from '../../../config/models/user.model';

const InviteService: IInviteService = {
    async invite(body: { recipient: string }, user: IUserModel) {
        const usr = await UserModel.findOne({ telegramUserId: user.telegramUserId });
        if (!usr || !usr._id) {
            return { 
                success: false 
            };
        }
        return { 
            success: true, 
            referralId: usr._id.toString()
        };
    },
};

export default InviteService;