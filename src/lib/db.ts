import {Logger} from '@/lib/Logger';
import env from 'json-env';
import {Pool, PoolClient, QueryConfig, QueryResult} from 'pg';
import {range} from 'utils';

const logger = new Logger('DB');
const pool = new Pool({
    host: env.get('db.host'),
    port: env.get('db.port'),
    database: env.get('db.name'),
    user: env.get('db.user'),
    password: env.get('db.password')
});

async function execQuery(poolOrClient: Pool | PoolClient, queryTextOrConfig: string | QueryConfig, params: any[] = []) {
    const start = Date.now();
    let result;
    let text;
    if (typeof queryTextOrConfig === 'string') {
        text = queryTextOrConfig;
        result = await pool.query(queryTextOrConfig, params);
    } else {
        text = queryTextOrConfig.text;
        params = queryTextOrConfig.values || [];
        result = await pool.query(queryTextOrConfig);
    }
    const duration = Date.now() - start;
    logger.debug(`executed query\n${text}\nDuration: (${duration}ms)  RowCount: ${result.rowCount}${
        params && params.length > 0 ?
            `\nParams: (${range(params.length).map(idx => `$${idx+1}(${typeof params[idx]})=>${params[idx]}`).join(', ')})`
            :''
    }`);
    return {result, duration}
}

export const query = (queryTextOrConfig: string | QueryConfig, params: any[] = []) => new Promise<QueryResult>(async (resolve, reject) => {
    try {
        const {result} = await execQuery(pool, queryTextOrConfig, params);
        resolve(result);
    } catch (e) {
        reject(e);
    }
});

export interface ClientWrapper {
    client: PoolClient,
    release: ()=>void,
    query: (queryTextOrConfig: string | QueryConfig, params?: any[]) => Promise<QueryResult>
}
export const getClient = () => new Promise<ClientWrapper>(async (resolve, reject) => {
    try {
        const client = await pool.connect();
        const queryList: Array<{text:string, duration:number}> = [];
        const timeout = setTimeout(() => {
            logger.warn('A client has been checked out for more than 5 seconds!');
            logger.warn(`QueryList: [\n${queryList.map(a=>`{\n\tDuration => ${a.duration}ms,\n\tText => ${a.text}`).join('\n')}]`);
        }, 5000);

        resolve({
            client,
            release(err: boolean | Error = false) {
                if (typeof err === 'boolean') {
                    err = new Error('releaseError');
                }
                client.release(err);
                clearTimeout(timeout);
            },
            query(queryTextOrConfig: string | QueryConfig, params: any[] = []) {
                return new Promise<QueryResult>(async (queryResolve, queryReject) => {
                    try {
                        const text = typeof queryTextOrConfig === 'string' ? queryTextOrConfig : queryTextOrConfig.text;
                        const item = {text, duration: -1};
                        queryList.push(item);
                        const {result, duration} = await execQuery(client, queryTextOrConfig, params);
                        item.duration = duration;
                        queryResolve(result);
                    } catch (e) {
                        queryReject(e);
                    }
                });
            }
        });
    } catch (e) {
        reject(e);
    }
});

