import {LogData, Logger} from 'custom-logger';
import env from 'json-env';

export function createLogger<SUB_DATA = {subLabel?: string}>(label = '_DEFAULT', consoleFormat?: (data: LogData<SUB_DATA> | any ) => string) {
    const defaultLevel: any = env.getString(`log.${label}.level`, env.getBool('production', false) ? 'error' : 'info');
    const consoleLevel: any = env.getString(`log.${label}.consoleLevel`, defaultLevel);
    const fileLevel: any = env.getString(`log.${label}.fileLevel`, defaultLevel);
    const dirname = env.getString(`log.${label}.path`, './logs');

    return new Logger<SUB_DATA>({
        label,
        defaultLevel,
        consoleLevel,
        fileLevel,
        dirname,
        consoleFormat
    })
}
