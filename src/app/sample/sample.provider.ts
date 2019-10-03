import {DatabaseProvider} from '@/app/common/database/database.provider';
import {SampleUserInput} from '@/generated-models';
import {orderByIdArray} from '@/lib/ApolloUtil';
import {Injectable, ProviderScope} from '@graphql-modules/di';


@Injectable({
    scope: ProviderScope.Session
})
export class SampleProvider {
    constructor(
        private db: DatabaseProvider,
    ){}

    async sampleUserBatch(idArr: number[]) {
        const res = await this.db.query(`
            SELECT * FROM test_data WHERE id = ANY($1::int[]);
        `, [idArr]);
        return orderByIdArray(res.rows, idArr);
    }

    async sampleUserList() {
        const res = await this.db.query(`
            SELECT * FROM test_data;
        `);
        return res.rows;
    }

    async insertSampleUser(test: SampleUserInput) {
        try {
            const res = await this.db.query(`
                INSERT INTO test_data (name, hobby) VALUES ($1, $2) RETURNING *;
            `, [test.name, test.hobby]);
            return res.rows[0];
        } catch (e) {
            throw e;
        }
    }
}