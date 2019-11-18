import env from './libraries/json-env';

const knexfile = {
    client: 'pg',
    connection: {
        host: env.get('db.host'),
        port: env.get('db.port'),
        database: env.get('db.name'),
        user: env.get('db.user'),
        password: env.get('db.password')
    },
    migrations: {
        extension: 'ts'
    }
};

export const client = knexfile.client;
export const connection = knexfile.connection;
export const migrations = knexfile.migrations;