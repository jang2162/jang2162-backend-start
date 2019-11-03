import env from 'json-env';

export default {
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
}