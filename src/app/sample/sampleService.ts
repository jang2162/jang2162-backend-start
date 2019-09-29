import {orderByIdArray} from '@/lib/ApolloUtil';
import {Service} from '@/lib/Service';
import {SampleUserInput} from './sampleResolver';


export class SampleService extends Service {
    async sampleUserBatch(idArr: number[]) {
        const client = await this.getClient();
        const res = await client.query(`
            SELECT * FROM test_data WHERE id = ANY($1::int[]);
        `, [idArr]);
        client.release();
        return orderByIdArray(res.rows, idArr);
    }

    async sampleUserList() {
        const client = await this.getClient();
        const res = await client.query(`
            SELECT * FROM test_data;
        `);
        client.release();
        return res.rows;
    }

    async insertSampleUser(test: SampleUserInput) {
        const client = await this.getClient();
        try {
            const res = await client.query(`
                INSERT INTO test_data (name, hobby) VALUES ($1, $2) RETURNING *;
            `, [test.name, test.hobby]);
            client.release();
            return res.rows[0];
        } catch (e) {
            throw e;
        }
    }
}