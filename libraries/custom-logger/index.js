"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
class Logger {
    constructor(options) {
        this.options = options;
        const label = options.label;
        const consoleLevel = options.consoleLevel || options.defaultLevel;
        const fileLevel = options.fileLevel || options.defaultLevel;
        this.curLogger = winston_1.default.createLogger({
            level: options.defaultLevel,
            transports: [
                new winston_1.default.transports.Console({
                    level: consoleLevel,
                    format: winston_1.format.combine(winston_1.format.label({ label }), winston_1.format.timestamp(), winston_1.format.printf(info1 => (options.consoleFormat ? options.consoleFormat(info1) :
                        `${info1.timestamp} [${label}${info1.subData && info1.subData.subLabel ? `:${info1.subData.subLabel}` : ''}] ${info1.level}: ${info1.message}`).split('\n').join('\n    ').trim()))
                }),
                new winston_daily_rotate_file_1.default({
                    level: fileLevel,
                    dirname: options.dirname,
                    filename: `${label}-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '30m',
                    zippedArchive: true,
                    format: winston_1.format.combine(winston_1.format.label({ label }), winston_1.format.timestamp(), winston_1.format.json())
                })
            ]
        });
    }
    log(level, message, subData) {
        if (subData) {
            this.curLogger.log({
                level, message, subData
            });
        }
        else {
            this.curLogger.log({ level, message });
        }
    }
    debug(message, subData) {
        this.log('debug', message, subData);
    }
    info(message, subData) {
        this.log('info', message, subData);
    }
    warn(message, subData) {
        this.log('warn', message, subData);
    }
    error(message, subData) {
        this.log('error', message, subData);
    }
}
exports.Logger = Logger;
