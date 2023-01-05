import dotenv from 'dotenv';
import {LogLevel} from './utils/createLogger';

dotenv.config({path: '../.env'});

export class Env {
    static readonly NODE_ENV = envString(process.env.NODE_ENV, 'development')
    static readonly SERVER_ORIGIN = envString(process.env.SERVER_ORIGIN, 'http://localhost:4200')
    static readonly SERVER_PORT = envInt(process.env.SERVER_PORT, 4200)
    static readonly CORS_ORIGIN = envString(process.env.CORS_ORIGIN, '*')
    static readonly JWT_ISSUER = envString(process.env.JWT_ISSUER, 'APP')
    static readonly JWT_SECRET = envStringErr(process.env.JWT_SECRET)
    static readonly JWT_EXPIRED_IN = envInt(process.env.JWT_EXPIRED_IN, 600)
    static readonly JWT_REFRESH_EXPIRED_IN = envInt(process.env.JWT_REFRESH_EXPIRED_IN, 1209600)
    static readonly JWT_COOKIE_SECURE = envBool(process.env.JWT_COOKIE_SECURE, false)
    static readonly JWT_COOKIE_DOMAIN = envString(process.env.JWT_COOKIE_DOMAIN, '')
    static readonly DB_HOST = envStringErr(process.env.DB_HOST)
    static readonly DB_PORT = envIntErr(process.env.DB_PORT)
    static readonly DB_NAME = envStringErr(process.env.DB_NAME)
    static readonly DB_USER = envStringErr(process.env.DB_USER)
    static readonly DB_PASSWORD = envStringErr(process.env.DB_PASSWORD)
    static readonly LOG_DEFAULT_LEVEL = envLogLevel(process.env.LOG_DEFAULT_LEVEL, 'info')
    static readonly LOG_DEFAULT_FILE_DIR = envString(process.env.LOG_DEFAULT_FILE_DIR, './logs')

    static readonly LOG_KNEX_LEVEL = envLogLevel(process.env.LOG_KNEX_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_KNEX_CONSOLE_LEVEL = envLogLevel(process.env.LOG_KNEX_CONSOLE_LEVEL, Env.LOG_KNEX_LEVEL)
    static readonly LOG_KNEX_FILE_LEVEL = envLogLevel(process.env.LOG_KNEX_FILE_LEVEL, Env.LOG_KNEX_LEVEL)
    static readonly LOG_KNEX_FILE_DIR = envString(process.env.LOG_KNEX_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)

    static readonly LOG_DB_LEVEL = envLogLevel(process.env.LOG_DB_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_DB_CONSOLE_LEVEL = envLogLevel(process.env.LOG_DB_CONSOLE_LEVEL, Env.LOG_DB_LEVEL)
    static readonly LOG_DB_FILE_LEVEL = envLogLevel(process.env.LOG_DB_FILE_LEVEL, Env.LOG_DB_LEVEL)
    static readonly LOG_DB_FILE_DIR = envString(process.env.LOG_DB_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)

    static readonly LOG_APOLLO_LEVEL = envLogLevel(process.env.LOG_APOLLO_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_APOLLO_CONSOLE_LEVEL = envLogLevel(process.env.LOG_APOLLO_CONSOLE_LEVEL, Env.LOG_APOLLO_LEVEL)
    static readonly LOG_APOLLO_FILE_LEVEL = envLogLevel(process.env.LOG_APOLLO_FILE_LEVEL, Env.LOG_APOLLO_LEVEL)
    static readonly LOG_APOLLO_FILE_DIR = envString(process.env.LOG_APOLLO_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)

    static readonly LOG_APOLLO_ERROR_LEVEL = envLogLevel(process.env.LOG_APOLLO_ERROR_LEVEL, Env.LOG_DEFAULT_LEVEL)
    static readonly LOG_APOLLO_ERROR_CONSOLE_LEVEL = envLogLevel(process.env.LOG_APOLLO_ERROR_CONSOLE_LEVEL, Env.LOG_APOLLO_ERROR_LEVEL)
    static readonly LOG_APOLLO_ERROR_FILE_LEVEL = envLogLevel(process.env.LOG_APOLLO_ERROR_FILE_LEVEL, Env.LOG_APOLLO_ERROR_LEVEL)
    static readonly LOG_APOLLO_ERROR_FILE_DIR = envString(process.env.LOG_APOLLO_ERROR_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR)
}


function envString(value: string | undefined, defaultValue: string): string {
    return value ?? defaultValue;
}

function envStringErr(value: string | undefined): string {
    if (value === undefined) {
        throw new Error('Empty environment given.');
    }
    return value;
}

function envInt(value: string | undefined, defaultValue: number): number {
    return value === undefined ? defaultValue : parseInt(value, 10);
}
function envIntErr(value: string | undefined): number {
    if (value === undefined) {
        throw new Error('Empty environment given.');
    }
    return parseInt(value, 10);
}
function envFloat(value: string | undefined, defaultValue: number): number {
    return value === undefined ? defaultValue : parseFloat(value);
}
function envFloatErr(value: string | undefined): number {
    if (value === undefined) {
        throw new Error('Empty environment given.');
    }
    return parseFloat(value);
}function envBool(value: string | undefined, defaultValue?: boolean): boolean {
    if (value && ['true', 'false'].indexOf(value.toLowerCase()) > 0) {
        return value.toLowerCase() === 'true'
    }
    throw new Error('invalid boolean value environment given.');
}

function envLogLevel(value: string | undefined, defaultValue: LogLevel): LogLevel {
    if (value && ['debug', 'info', 'warn' ,'error'].indexOf(value) === -1) {
        throw new Error('log level must be one of debug, info, wran, error.');
    }
    return value ? (value as LogLevel) : defaultValue;
}

