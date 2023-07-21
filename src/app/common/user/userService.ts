import axios from 'axios';
import {Request, Response} from 'express';
import {injectable, inject} from 'tsyringe';
import {AuthInfoService} from '@/app/common/auth/authInfoService';
import {selectUser} from '@/app/common/user/userQuery';
import {REQUEST, RESPONSE} from '@/utils/gqlAppBuilder';
import {redisClient} from "@/redisClient";
import {ResolversTypes, User} from "@/generated-models";


@injectable()
export class UserService {

    constructor(
        @inject(AuthInfoService) private authInfoService: AuthInfoService,
        @inject(REQUEST) private req: Request,
        @inject(RESPONSE) private res: Response
    ) { }

    public async getMyInfo(): Promise<User> {
        const userData = this.authInfoService.getInfo()
        const userInfoStr = await redisClient.get(`USER:${userData.uid}`)
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            return {
                id: userData.uid.toString(),
                avatar: userInfo.avatar,
                discordUserId: userInfo.id,
                name: userInfo.username,
                discriminator: userInfo.discriminator,
            }
        }
        return null
    }

}

