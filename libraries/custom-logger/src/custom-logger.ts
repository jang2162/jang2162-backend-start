import winston, {format} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogData<SUB_DATA> {
    level: LogLevel,
    message: string
    label: string,
    timestamp: string,
    subData: SUB_DATA
}

export class Logger<SUB_DATA = {subLabel?: string}> {
    curLogger: winston.Logger;
    constructor(
        private options: {
            label: string,
            defaultLevel: LogLevel,
            dirname: string
            consoleLevel?: LogLevel,
            fileLevel?: LogLevel,
            consoleFormat?: (data: LogData<SUB_DATA> | any ) => string
        },
    ) {
        const label = options.label;
        const consoleLevel = options.consoleLevel || options.defaultLevel;
        const fileLevel = options.fileLevel || options.defaultLevel;

        this.curLogger =  winston.createLogger({
            level: options.defaultLevel,
            transports: [
                new winston.transports.Console({
                    level: consoleLevel,
                    format: format.combine(
                        format.label({ label }),
                        format.timestamp(),
                        format.printf(info1 => (
                            options.consoleFormat ? options.consoleFormat(info1) :
                                `${info1.timestamp} [${label}${info1.subData && info1.subData.subLabel ? `:${info1.subData.subLabel}`:''}] ${info1.level}: ${info1.message}`
                        ).split('\n').join('\n    ').trim())
                    )
                }),
                new DailyRotateFile({
                    level: fileLevel,
                    dirname: options.dirname,
                    filename: `${label}-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '30m',
                    zippedArchive: true,
                    format: format.combine(
                        format.label({ label }),
                        format.timestamp(),
                        format.json()
                    )
                })
            ]
        });
    }

    log(level: 'debug' | 'info' | 'warn' | 'error', message: string, subData?: SUB_DATA): void {
        if (subData){
            this.curLogger.log({
                level, message, subData
            })
        } else {
            this.curLogger.log({level, message})
        }
    }

    debug(message: string, subData?: SUB_DATA) {
        this.log('debug', message, subData)
    }

    info(message: string, subData?: SUB_DATA) {
        this.log('info', message, subData)
    }

    warn(message: string, subData?: SUB_DATA) {
        this.log('warn', message, subData)
    }

    error(message: string, subData?: SUB_DATA) {
        this.log('error', message, subData)
    }
}
