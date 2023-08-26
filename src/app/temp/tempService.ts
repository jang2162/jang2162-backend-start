import DataLoader from 'dataloader';
import {injectable, inject, Lifecycle, scoped} from 'tsyringe';
import {AuthInfoService} from '@/app/common/auth/authInfoService';
import {DatabaseConnectionService} from '@/app/common/database/databaseConnectionService';
import {
    MutationInsertTempPostArgs,
    MutationInsertTempUserArgs,
    TempPost, TempUser
} from '@/generated-models';


let postIdInc: number;
postIdInc = 1;
let userIdInc = 1;
const postDataList: TempPost[] = []
const userDataList: TempUser[] = []

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class TempService {
    private postDataLoader = new DataLoader<number, TempPost>(async keys => keys.map(key => postDataList.find(item => item.postId === key)))
    private userDataLoader = new DataLoader<number, TempUser>(async keys => keys.map(key => userDataList.find(item => item.userId === key)))
    private userPostsDataLoader = new DataLoader<number, TempPost[]>(async keys => {
        const posts = postDataList.filter(item => keys.indexOf(item.writerId) >= 0)
        return keys.map(key => posts.filter(item => item.writerId === key))
    })

    constructor(
        @inject(DatabaseConnectionService) private db: DatabaseConnectionService,
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
        // throw new Error()
        userDataList.push({
            id: '', // for Test
            posts:[], // for Test

            userId: userIdInc++,
            name,
            birth,
        })
    }

    insertTempPost({title, writerId, content}: MutationInsertTempPostArgs) {
        postDataList.push({
            id: '', // for Test
            writer: {id:'', userId: 0, posts: [], birth: new Date(), name: ''}, // for Test

            postId: userIdInc++,
            title,
            content,
            regDate: new Date(),
            writerId,
        })
    }

    selectUserPosts(userId: number) {
        return this.userPostsDataLoader.load(userId)
    }
}
