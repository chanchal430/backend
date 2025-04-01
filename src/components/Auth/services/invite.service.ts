import { IInviteService } from "../interface";
import UserModel from '../../../config/models/user.model'

const InviteService: IInviteService = {

    async invite(_, user) {
        const usr = await UserModel.findOne({ telegramUserId: user.telegramUserId });
        if (!usr || !usr._id) return 0;
        return { success: true, referralId: usr._id };
    },
}

export default InviteService;
