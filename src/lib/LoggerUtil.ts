import env from 'json-env';
import winston, {format} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const loggerMapper: {[k: string]: Logger} = {};
export function getLogger(name: string = '_DEFAULT') {
    name = name.toLocaleUpperCase();
    if (name in loggerMapper) {
        return loggerMapper[name];
    }
    return loggerMapper[name] = new Logger(name);
}

class Logger<SUB_DATA = string> {
    curLogger: winston.Logger;
    constructor(
        label: string = '_DEFAULT',
        private readonly dataConverter?: (level: 'debug' | 'info' | 'warn' | 'error', message: string, subData?: SUB_DATA) => {[optionName: string]: any},
        private readonly consoleFormat?: (data: ({message: string, level: string, [optionName: string]: any})) => string
    ) {
        this.dataConverter = dataConverter;
        const defaultLevel = env.getString(`log.${label}.level`, env.getBool('production', false) ? 'error' : 'info');
        const consoleLevel = env.getString(`log.${label}.consoleLevel`, defaultLevel);
        const fileLevel = env.getString(`log.${label}.fileLevel`, defaultLevel);
        this.curLogger =  winston.createLogger({
            level: defaultLevel,
            transports: [
                new winston.transports.Console({
                    level: consoleLevel,
                    format: format.combine(
                        format.label({ label }),
                        format.timestamp(),
                        format.printf(
                            this.consoleFormat ||
                            (
                                ({ level, message, subLabel, timestamp }) => `${timestamp} [${label}${subLabel ? `:${subLabel}`:''}] ${level}: ${message}`
                            )
                        )
                    )
                }),
                new DailyRotateFile({
                    level: fileLevel,
                    dirname: env.getString(`log.${label}.path`, './logs'),
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
        if (this.dataConverter) {
            this.curLogger.log({
                ...this.dataConverter(level, message, subData),
                level,
                message
            })
        } else if (subData){
            if (typeof subData === 'string' || typeof subData === 'number') {
                this.curLogger.log({level, message, subLabel: subData})
            } else if (typeof subData === 'object'){
                this.curLogger.log({
                    ...subData,
                    level, message
                })
            }
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

export default getLogger;