import {Logger} from '@/lib/Logger';
import {OnRequest, OnResponse} from '@graphql-modules/core';
import {Inject, Injectable, ProviderScope} from '@graphql-modules/di';
import {Pool, PoolClient, QueryConfig, QueryResult} from 'pg';
import SQL from 'sql-template-strings';
import {range} from 'utils';
import {DB_LOGGER} from './database.module';
import Timeout = NodeJS.Timeout;

const logger = new Logger('DB');

@Injectable({
    scope: ProviderScope.Session
})
export class DatabaseProvider implements OnRequest, OnResponse {
    private client?: PoolClient;
    private queryList: Array<{text:string, duration:number}> = [];
    private timeout?: Timeout;
    private logger = logger;

    constructor(
        // @Inject(DB_LOGGER) private logger: Logger,
        private pool: Pool,
    ) {}

    async onRequest() {
        this.client = await this.pool.connect();
    }

    onResponse() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if (this.client) {
            this.client.release();
        }
    }

    async getClient() {
        if (this.client) {
            return this.client;
        }
        throw Error();
    }

    async query(queryText: string, params?: any[]): Promise<QueryResult>;
    async query(queryConfig: QueryConfig): Promise<QueryResult>;
    async query(queryTextOrConfig: string | QueryConfig, params: any[] = []): Promise<QueryResult>{
        if(this.queryList.length === 0) {
            this.timeout = setTimeout(() => {
                this.logger.warn('A client has been checked out for more than 5 seconds!');
                this.logger.warn(`QueryList: [\n${this.queryList.map(a=>`{\n\tDuration => ${a.duration}ms,\n\tText => ${a.text}`).join('\n')}]`);
            }, 5000);
        }

        const client = await this.getClient();
        const start = Date.now();
        const item = {duration: -1, text: ''};
        let result;
        this.queryList.push(item);
        if (typeof queryTextOrConfig === 'string') {
            item.text = queryTextOrConfig;
            result = await client.query(queryTextOrConfig, params);
        } else {
            item.text = queryTextOrConfig.text;
            result = await client.query(queryTextOrConfig);
        }

        item.duration = Date.now() - start;
        this.logger.debug(`executed query\n${item.text}\nDuration: (${item.duration}ms)  RowCount: ${result.rowCount}${
            params && params.length > 0 ?
                `\nParams: (${range(params.length).map(idx => `$${idx+1}(${typeof params[idx]})=>${params[idx]}`).join(', ')})`
                :''
        }`);

        return result;
    }

    async begin() {
        await this.query('BEGIN');
    }

    async commit() {
        await this.query('COMMIT');
    }

    async savePoint(point: string) {
        await this.query(SQL`SAVEPOINT `.append(point));
    }

    async rollback(point?: string) {
        if (point) {
            await this.query(SQL`ROLLBACK TO `.append(point));
        } else {
            await this.query('ROLLBACK');
        }
    }
}