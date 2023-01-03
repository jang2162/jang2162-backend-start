import {Env} from './src/env';

const knexfile = {
    client: 'pg',
    connection: {
        host: Env.DB_HOST,
        port: Env.DB_PORT,
        database: Env.DB_NAME,
        user: Env.DB_USER,
        password: Env.DB_PASSWORD,
    },
    migrations: {
        extension: 'ts'
    }
};

export const client = knexfile.client;
export const connection = knexfile.connection;
export const migrations = knexfile.migrations;
