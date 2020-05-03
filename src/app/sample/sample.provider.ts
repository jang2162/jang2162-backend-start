import {AuthProvider} from '@/app/common/auth/auth.provider';
import {DatabaseProvider} from '@/app/common/database/database.provider';
import {PaginationUtilProvider} from '@/app/common/pagination/pagination-util.provider';
import {
    Maybe,
    SamplePost,
    SamplePostConnection,
    SamplePostForm,
    SampleUser,
    SampleUserConnection,
    SampleUserForm, SampleUserInput
    } from '@/generated-models';
import {orderByIdArray} from '@/lib/apolloUtil';
import {Injectable, ProviderScope} from '@graphql-modules/di';
import DataLoader from 'dataloader';

@Injectable({
    scope: ProviderScope.Session
})
export class SampleProvider {

    private sampleUserDataLoader = new DataLoader<string, SampleUser>(keys => this.sampleUserBatch(keys));
    private samplePostDataLoader = new DataLoader<string, SamplePost>(keys => this.samplePostBatch(keys));

    constructor(
        private db: DatabaseProvider,
        private pageUtil: PaginationUtilProvider,
    ){}

    async samplePostBatch(idArr: string[]) {
        const trx = await this.db.getTrx();
        const res = await trx('sample_post').whereIn('id', idArr);
        return orderByIdArray(res, idArr);
    }

    async sampleUserBatch(idArr: string[]) {
        const trx = await this.db.getTrx();
        const res = await trx('sample_user').whereIn('id', idArr);
        return orderByIdArray(res, idArr);
    }

    async sampleUserConnection(form: Maybe<SampleUserForm>): Promise<SampleUserConnection> {
        if (!form) {
            throw Error();
        }
        const trx = await this.db.getTrx();
        const builder = trx('sample_user')
            .select('*');
        return this.pageUtil.getConnection(builder, form.page);
    }

    async sampleUserById(id: string) {
        return this.sampleUserDataLoader.load(id);
    }

    async insertSampleUser(test: SampleUserInput) {
        const trx = await this.db.getTrx();
        const res = await trx('sample_user').insert({
            name: test.name,
            birthday: test.birthday,
        }).returning('*');
        return res[0];
    }

    async samplePostConnection(form: Maybe<SamplePostForm>): Promise<SamplePostConnection> {
        if (!form) {
            throw Error();
        }
        const trx = await this.db.getTrx();
        const builder = trx('sample_post')
            .select('*');

        if (form.userId) {
            builder.where('writer_id', form.userId);
        }

        return this.pageUtil.getConnection(builder, form.page);
    }

    async samplePostById(id: string) {
        return this.samplePostDataLoader.load(id);
    }
}