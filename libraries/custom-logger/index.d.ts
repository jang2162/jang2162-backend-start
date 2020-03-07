export class Logger<SUB_DATA = {
    subLabel?: string;
}> {
    curLogger: winston.Logger;
    private options;
    constructor(private options: {
        label: string;
        defaultLevel: LogLevel;
        dirname: string;
        consoleLevel?: LogLevel;
        fileLevel?: LogLevel;
        consoleFormat?: (data: any) => string;
    });
    log(level: LogLevel, message: string, subData?: SUB_DATA): void;
    debug(message: string, subData?: SUB_DATA): void;
    info(message: string, subData?: SUB_DATA): void;
    warn(message: string, subData?: SUB_DATA): void;
    error(message: string, subData?: SUB_DATA): void;
}

export interface LogData<SUB_DATA> {
    level: LogLevel,
    message: string
    label: string,
    timestamp: string,
    subData: SUB_DATA
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';