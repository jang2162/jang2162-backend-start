import {createLogger} from '@/utils/createLogger';
import {Injectable} from 'graphql-modules';
import env from 'json-env';
import Knex from 'knex';
import {range} from 'utils';
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

interface DbLoggerSubData {
    // debug
    queryText?: string
    params?: any[],
    rowCount?: number,
    duration?: number,

    // error
    code?: string,
    position?: string
}

const dbLogger = createLogger<DbLoggerSubData>('DB',
    ({ level, message, subData, timestamp }) => `${timestamp} [DB] ${level}: ${
        level === 'debug'
            ? `executed query\nQuery: ${subData.queryText}\nDuration: ${subData.duration}ms\nRowCount: ${subData.rowCount}${
                subData.params && subData.params.length > 0 ?
                    `\nParams: (${range(subData.params.length).map(idx => `$${idx+1}=>${ subData.params[idx]}`).join(', ')})`
                    :''
            }`
            :
            level === 'error'
                ? `(${subData.code}, ${subData.position}) ${message}`
                : message }`
)

@Injectable({
    global: true
})
export class DatabaseTransactionProvider  {
    readonly knex: Knex = knex;

    async getTransaction() {
        const trx = await knex.transaction();
        const queryList: Array<{text:string, duration:number, id: string, start: number, params?: any[]}> = [];
        let timeout: Timeout;
        const startListener = (builder: Knex) => {
            builder
                .on('query', (data) => {
                    if(queryList.length === 0) {
                        timeout = setTimeout(() => {
                            dbLogger.warn('A client has been checked out for more than 5 seconds!\n' +
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
                        dbLogger.debug('query executed.', {
                            queryText: item.text,
                            params: item.params &&  item.params.length > 0 ? item.params : undefined,
                            duration: item.duration,
                            rowCount: data.response.rowCount,
                        });
                    }
                })
                .on('query-error', (error, obj) => dbLogger.error(error.message, {
                    code: error.code,
                    position: error.position,
                    queryText: obj.sql,
                }))
        };
        trx.on('start', startListener)
        return {
            trx,
            release: async (err = false) => {
                trx.client.removeListener('start', startListener);
                if (timeout) {
                    clearTimeout(timeout);
                }

                if (!err) {
                    await trx.commit();
                } else {
                    await trx.rollback();
                }
            }
        };
    }
}