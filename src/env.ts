import dotenv from 'dotenv';
import {envUtil} from '@/utils/envUtil';
dotenv.config({path: '../.env'});

export class Env {
    static readonly NODE_ENV = envUtil.string(process.env.NODE_ENV, 'development')
    static readonly CORS_ORIGIN = envUtil.string(process.env.CORS_ORIGIN, undefined)
    static readonly CORS_CREDENTIALS = envUtil.bool(process.env.CORS_CREDENTIALS, false)
    static readonly SERVER_ORIGIN = envUtil.string(process.env.SERVER_ORIGIN, 'http://localhost:4200')
    static readonly SERVER_PORT = envUtil.int(process.env.SERVER_PORT, 4200)
    static readonly JWT_ISSUER = envUtil.string(process.env.JWT_ISSUER, 'APP')
    static readonly JWT_SECRET = envUtil.stringErr(process.env.JWT_SECRET)
    static readonly JWT_EXPIRED_IN = envUtil.int(process.env.JWT_EXPIRED_IN, 600)
    static readonly JWT_REFRESH_EXPIRED_IN = envUtil.int(process.env.JWT_REFRESH_EXPIRED_IN, 1209600)
    static readonly JWT_COOKIE_SECURE = envUtil.bool(process.env.JWT_COOKIE_SECURE, false)
    static readonly JWT_COOKIE_DOMAIN = envUtil.string(process.env.JWT_COOKIE_DOMAIN, '')
    static readonly DB_HOST = envUtil.stringErr(process.env.DB_HOST)
    static readonly DB_PORT = envUtil.intErr(process.env.DB_PORT)
    static readonly DB_NAME = envUtil.stringErr(process.env.DB_NAME)
    static readonly DB_USER = envUtil.stringErr(process.env.DB_USER)
    static readonly DB_PASSWORD = envUtil.stringErr(process.env.DB_PASSWORD)
    static readonly LOG_DEFAULT_LEVEL = envUtil.logLevel(process.env.LOG_DEFAULT_LEVEL, 'info')
    static readonly LOG_DEFAULT_FILE_DIR = envUtil.string(process.env.LOG_DEFAULT_FILE_DIR, './logs')

    static readonly LOG_KNEX_LEVEL = envUtil.logLevel(process.env.LOG_KNEX_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_KNEX_CONSOLE_LEVEL = envUtil.logLevel(process.env.LOG_KNEX_CONSOLE_LEVEL, Env.LOG_KNEX_LEVEL)
    static readonly LOG_KNEX_FILE_LEVEL = envUtil.logLevel(process.env.LOG_KNEX_FILE_LEVEL, Env.LOG_KNEX_LEVEL)
    static readonly LOG_KNEX_FILE_DIR = envUtil.string(process.env.LOG_KNEX_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)

    static readonly LOG_DB_LEVEL = envUtil.logLevel(process.env.LOG_DB_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_DB_CONSOLE_LEVEL = envUtil.logLevel(process.env.LOG_DB_CONSOLE_LEVEL, Env.LOG_DB_LEVEL)
    static readonly LOG_DB_FILE_LEVEL = envUtil.logLevel(process.env.LOG_DB_FILE_LEVEL, Env.LOG_DB_LEVEL)
    static readonly LOG_DB_FILE_DIR = envUtil.string(process.env.LOG_DB_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)

    static readonly LOG_GQL_LEVEL = envUtil.logLevel(process.env.LOG_GQL_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_GQL_CONSOLE_LEVEL = envUtil.logLevel(process.env.LOG_GQL_CONSOLE_LEVEL, Env.LOG_GQL_LEVEL)
    static readonly LOG_GQL_FILE_LEVEL = envUtil.logLevel(process.env.LOG_GQL_FILE_LEVEL, Env.LOG_GQL_LEVEL)
    static readonly LOG_GQL_FILE_DIR = envUtil.string(process.env.LOG_GQL_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)

    static readonly LOG_APOLLO_ERROR_LEVEL = envUtil.logLevel(process.env.LOG_APOLLO_ERROR_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_APOLLO_ERROR_CONSOLE_LEVEL = envUtil.logLevel(process.env.LOG_APOLLO_ERROR_CONSOLE_LEVEL, Env.LOG_APOLLO_ERROR_LEVEL)
    static readonly LOG_APOLLO_ERROR_FILE_LEVEL = envUtil.logLevel(process.env.LOG_APOLLO_ERROR_FILE_LEVEL, Env.LOG_APOLLO_ERROR_LEVEL)
    static readonly LOG_APOLLO_ERROR_FILE_DIR = envUtil.string(process.env.LOG_APOLLO_ERROR_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)
}
