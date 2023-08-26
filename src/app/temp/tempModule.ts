import {TempService} from '@/app/temp/tempService';
import {GqlAppBuilderModule} from '@/utils/gqlAppBuilder';

export const tempModule: GqlAppBuilderModule = {
    resolvers: {
        Query: {
            selectUsers: injector => injector.resolve<TempService>(TempService).selectUsers(),
            selectPosts: injector => injector.resolve<TempService>(TempService).selectPosts(),
            selectUserById: (injector, parent, {id}) => injector.resolve<TempService>(TempService).selectUserById(id),
            selectPostById: (injector, parent, {id}) => injector.resolve<TempService>(TempService).selectPostById(id),
        },
        Mutation: {
            insertTempUser: (injector, parent, args) => injector.resolve<TempService>(TempService).insertTempUser(args),
            insertTempPost: (injector, parent, args) => injector.resolve<TempService>(TempService).insertTempPost(args),

        },
        TempPost: {
            id: (injector, parent) => parent.postId.toString(),
            writer: (injector, {writerId}) => injector.resolve<TempService>(TempService).selectUserById(writerId)
        },
        TempUser: {
            id: (injector, parent) => parent.userId.toString(),
            posts:  (injector, parent) => injector.resolve<TempService>(TempService).selectUserPosts(parent.userId)

        }
    }
}
