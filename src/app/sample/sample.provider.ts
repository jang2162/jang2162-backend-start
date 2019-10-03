import {DatabaseProvider} from '@/app/common/database/database.provider';
import {SamplePost, SampleUser, SampleUserInput} from '@/generated-models';
import {orderByIdArray} from '@/lib/ApolloUtil';
import {Injectable, ProviderScope} from '@graphql-modules/di';
import DataLoader from 'dataloader';
import SQL from 'sql-template-strings';


@Injectable({
    scope: ProviderScope.Session
})
export class SampleProvider {

    // private sampleUserPostsDataLoader = new DataLoader<number, SamplePost[]>(keys => this.sampleUserPostsBatch(keys));
    private sampleUserDataLoader = new DataLoader<number, SampleUser>(keys => this.sampleUserBatch(keys));
    private samplePostDataLoader = new DataLoader<number, SamplePost>(keys => this.samplePostBatch(keys));

    constructor(
        private db: DatabaseProvider,
    ){}

    async sampleUserPostsBatch(idArr: number[]) {
        const res = await this.db.query(`
            SELECT * FROM test_data WHERE id = ANY($1::int[]);
        `, [idArr]);
        return orderByIdArray(res.rows, idArr);
    }

    async samplePostBatch(idArr: number[]) {
        const res = await this.db.query(`
            SELECT * FROM test_data WHERE id = ANY($1::int[]);
        `, [idArr]);
        return orderByIdArray(res.rows, idArr);
    }

    async sampleUserBatch(idArr: number[]) {
        const res = await this.db.query(`
            SELECT * FROM test_data WHERE id = ANY($1::int[]);
        `, [idArr]);
        return orderByIdArray(res.rows, idArr);
    }

    async sampleUserList() {
        const res = await this.db.query(`
            SELECT * FROM sample_user;
        `);
        return res.rows;
    }

    async sampleUserById(id: number) {
        return this.sampleUserDataLoader.load(id);
    }

    async samplePostList() {
        const res = await this.db.query(`
            SELECT * FROM test_data;
        `);
        return res.rows;
    }

    async insertSampleUser(test: SampleUserInput) {
        try {
            const res = await this.db.query(`
                INSERT INTO sample_user (name, birthday) VALUES ($1, $2) RETURNING *;
            `, [test.name, test.birthday]);
            return res.rows[0];
        } catch (e) {
            throw e;
        }
    }
}