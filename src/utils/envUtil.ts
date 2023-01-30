import {LogLevel} from '@/utils/createLogger';


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
}
function envBool(value: string | undefined, defaultValue?: boolean): boolean {
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

export const envUtil = {
    string: envString,
    stringErr: envStringErr,
    int: envInt,
    intErr: envIntErr,
    float: envFloat,
    floatErr: envFloatErr,
    bool: envBool,
    logLevel: envLogLevel,
}
