import {Logger} from '@/lib/Logger';
import { OnRequest, OnResponse} from '@graphql-modules/core';
import {Inject, Injectable, ProviderScope} from '@graphql-modules/di';
import env from 'json-env';
import Knex from 'knex';
import {DbLogger} from './database.module';
import Timeout = NodeJS.Timeout;


const knexLogger = new Logger('KNEX');
const knex = Knex({
    client: 'pg',
    connection: {
        host: env.get('db.host'),
        port: env.get('db.port'),
        database: env.get('db.name'),
        user: env.get('db.user'),
        password: env.get('db.password')
    },
    log: {
        warn(message) {
            knexLogger.warn(message);
        },
        error(message) {
            knexLogger.error(message);
        },
        deprecate(message) {
            knexLogger.info(message);
        },
        debug(message) {
            knexLogger.debug(message);
        },
    }
});

@Injectable({
    scope: ProviderScope.Session
})
export class DatabaseProvider implements OnRequest, OnResponse {
    readonly knex: Knex = knex;
    private queryList: Array<{text:string, duration:number, id: string, start: number, params?: any[]}> = [];
    private timeout?: Timeout;
    private startListener: any;

    constructor(
        @Inject(Logger) private logger: DbLogger
    ) {}

    async onRequest() {
        this.startListener = (builder: Knex) => {
            builder
                .on('query', (data) => this.onQuery(data))
                .on('query-response', (response, obj, queryBuilder) => this.onQueryResponse(response, obj, queryBuilder))
                .on('query-error', (error, obj) => this.onQueryError(error, obj))
        };
        this.knex.client.on('start', this.startListener);
    }

    onResponse() {
        this.knex.client.removeListener('start', this.startListener);

        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onQuery(data: any) {
        if(this.queryList.length === 0) {
            this.timeout = setTimeout(() => {
                this.logger.warn('A client has been checked out for more than 5 seconds!\n' +
                    `QueryList: [{${this.queryList.map(a=>`\n\tQuery: ${a.text}\n\tDuration: ${a.duration}ms\n`).join('}, {')}}]`
                );
            }, 5000);
        }
        this.queryList.push({
            duration: -1,
            text: data.sql,
            params: data.bindings,
            id: data.__knexQueryUid,
            start: Date.now()
        });
    }

    onQueryResponse(response: any, data: any, queryBuilder: any) {
        const item = this.queryList.find(value => value.id === data.__knexQueryUid);
        if (item) {
            item.duration = Date.now() - item.start;
            this.logger.debug('query executed.', {
                queryText: item.text,
                params: item.params &&  item.params.length > 0 ? item.params : undefined,
                duration: item.duration,
                rowCount: data.response.rowCount,
            });
        }
    }

    onQueryError(error: any, obj: any) {
        this.logger.error(error.message, {
            code: error.code,
            position: error.position,
            queryText: obj.sql,
        });
    }

    async exec<T=any>(builder: Knex.QueryBuilder<T, any>): Promise<T> {
        return new Promise<T>((resolve, reject) =>
            builder.then(value => resolve(value)).catch(reason => reject(reason))
        )
    }
}