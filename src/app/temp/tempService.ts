import DataLoader from 'dataloader';
import {injectable, inject, Lifecycle, scoped} from 'tsyringe';
import {AuthInfoService} from '@/app/common/auth/authInfoService';
import {DatabaseConnectionService} from '@/app/common/database/databaseConnectionService';
import {
    MutationInsertTempPostArgs,
    MutationInsertTempUserArgs,
    TempPost, TempUser
} from '@/generated-models';


let postIdInc = 1;
let userIdInc = 1;
const postDataList: TempPost[] = []
const userDataList: TempUser[] = []

@injectable()
export class TempService {

    private postDataLoader = new DataLoader<number, TempPost>(async keys => keys.map(key => postDataList.find(item => item.postId === key)))
    private userDataLoader = new DataLoader<number, TempUser>(async keys => keys.map(key => userDataList.find(item => item.userId === key)))
    private userPostsDataLoader = new DataLoader<number, TempPost[]>(async keys => {
        console.log(keys);
        const posts = postDataList.filter(item => keys.indexOf(item.writerId) > 0)
        return keys.map(key => posts.filter(item => key === item.postId))
    }, {
        batchScheduleFn: callback => setTimeout(callback, 1000)
    })

    constructor(
        private db: DatabaseConnectionService,
        @inject(AuthInfoService) private authInfoService: AuthInfoService,
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

            postId: postIdInc++,
            title,
            content,
            regDate,
            writerId,
        })
    }

    selectUserPosts(userId: number) {
        return this.userPostsDataLoader.load(userId)
    }
}
