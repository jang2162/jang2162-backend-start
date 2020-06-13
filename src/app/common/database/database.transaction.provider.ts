import {createLogger} from '@/lib/createLogger';
import {Inject, Injectable, ProviderScope} from '@graphql-modules/di';
import {Logger} from 'custom-logger';
import env from 'json-env';
import Knex from 'knex';
import {DbLogger} from './database.module';
import Timeout = NodeJS.Timeout;


const knexLogger = createLogger('KNEX');
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

@Injectable()
export class DatabaseTransactionProvider  {
    readonly knex: Knex = knex;

    constructor(
        @Inject(Logger) private logger: DbLogger
    ) {}
    async getTransaction() {
        const trx = await knex.transaction();
        const queryList: Array<{text:string, duration:number, id: string, start: number, params?: any[]}> = [];
        let timeout: Timeout;
        const startListener = (builder: Knex) => {
            builder
                .on('query', (data) => {
                    if(queryList.length === 0) {
                        timeout = setTimeout(() => {
                            this.logger.warn('A client has been checked out for more than 5 seconds!\n' +
                                `QueryList: [{${queryList.map(a=>`\n\tQuery: ${a.text}\n\tDuration: ${a.duration}ms\n`).join('}, {')}}]`
                            );
                        }, 5000);
                    }
                    queryList.push({
                        duration: -1,
                        text: data.sql,
                        params: data.bindings,
                        id: data.__knexQueryUid,
                        start: Date.now()
                    });
                })
                .on('query-response', (response, data, queryBuilder) => {
                    const item = queryList.find(value => value.id === data.__knexQueryUid);
                    if (item) {
                        item.duration = Date.now() - item.start;
                        this.logger.debug('query executed.', {
                            queryText: item.text,
                            params: item.params &&  item.params.length > 0 ? item.params : undefined,
                            duration: item.duration,
                            rowCount: data.response.rowCount,
                        });
                    }
                })
                .on('query-error', (error, obj) => this.logger.error(error.message, {
                    code: error.code,
                    position: error.position,
                    queryText: obj.sql,
                }))
        };
        trx.on('start', startListener)
        return {
            trx,
            release: async (err: boolean = false) => {
                if (!err) {
                    await trx.commit();
                } else {
                    await trx.rollback();
                }
                trx.client.removeListener('start', startListener);
                if (timeout) {
                    clearTimeout(timeout);
                }
            }
        };
    }
}