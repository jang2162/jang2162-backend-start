import env from 'json-env';
import winston, {format} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const loggerMapper: {[k: string]: Logger} = {};
export function getLogger(name: string = '_default') {
    if (name in loggerMapper) {
        return loggerMapper[name];
    }
    return loggerMapper[name] = new Logger(name);
}

class Logger {
    curLogger: winston.Logger;
    constructor(label: string = '_DEFAULT') {
        this.curLogger =  winston.createLogger({
            level: env.getString(`logLevel.${label}`, env.getBool('production', false) ? 'error' : 'info'),
            transports: [
                new winston.transports.Console({
                    format: format.combine(
                        format.label({ label }),
                        format.timestamp(),
                        format.printf(({ level, message, subLabel, timestamp }) => {
                            return `${timestamp} [${label}${subLabel ? `:${subLabel}`:''}] ${level}: ${message}`;
                        })
                    )
                }),
                new DailyRotateFile({
                    dirname: env.getString('logPath', './logs'),
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

    log(level: 'debug' | 'info' | 'warn' | 'error', message: string, subLabel?: string): void {
        this.curLogger.log(subLabel ? {level, message, subLabel} : {level, message})
    }

    debug(message: string, subLabel?: string) {
        this.log('debug', message, subLabel)
    }

    info(message: string, subLabel?: string) {
        this.log('info', message, subLabel)
    }

    warn(message: string, subLabel?: string) {
        this.log('warn', message, subLabel)
    }

    error(message: string, subLabel?: string) {
        this.log('error', message, subLabel)
    }
}

export default getLogger;