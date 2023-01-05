import DataLoader from 'dataloader';
import {Request, Response} from 'express';
import {autoInjectable, inject} from 'tsyringe';
import {AuthInfoService} from '@/app/common/auth/authInfoService';
import {AuthService} from '@/app/common/auth/authService';
import {DatabaseConnectionService} from '@/app/common/database/databaseConnectionService';
import {
    MutationInsertTempPostArgs,
    MutationInsertTempUserArgs,
    TempPost, TempUser
} from '@/generated-models';


const postIdInc = 1;
let userIdInc = 1;
const postDataList: TempPost[] = []
const userDataList: TempUser[] = []

@autoInjectable()
export class TempService {

    private postDataLoader = new DataLoader<number, TempPost>(async keys => postDataList.filter(item => keys.indexOf(item.postId) > 0))
    private userDataLoader = new DataLoader<number, TempUser>(async keys => userDataList.filter(item => keys.indexOf(item.userId) > 0))
    private userPostsDataLoader = new DataLoader<number, TempPost[]>(async keys => {
        const posts = postDataList.filter(item => keys.indexOf(item.writerId) > 0)
        return keys.map(key => [])
    })

    constructor(
        private db: DatabaseConnectionService,
        @inject(AuthInfoService) private authInfoService: AuthInfoService
    ) {}


    selectUsers() {
        return userDataList;
    }

    selectPosts() {
        return postDataList;
    }

    selectUserById(id: number) {
        return this.userDataLoader.load(id);
    }

    selectPostById(id: number) {
        return this.postDataLoader.load(id);
    }

    insertTempUser({name, birth}: MutationInsertTempUserArgs) {
        userDataList.push({
            id: '', // for Test
            posts:[], // for Test

            userId: userIdInc++,
            name,
            birth,
        })
    }

    insertTempPost({title, writerId, content, regDate}: MutationInsertTempPostArgs) {
        postDataList.push({
            id: '', // for Test
            writer: {id:'', userId: 0, posts: [], birth: new Date(), name: ''}, // for Test

            postId: userIdInc++,
            title,
            content,
            regDate,
            writerId,
        })
    }

    selectUserPosts(userId: number) {


    }
}
