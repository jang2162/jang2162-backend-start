import clone from 'clone';
import {readFileSync} from 'fs';

export interface EnvI {
    [k: string]: any
}

const envData: EnvI = JSON.parse(readFileSync(process.env.ENV_PATH || './environments/dev.json', 'utf8').toString());
function get(key?: string, defaultValue?: any): any {
    if (!key) { return envData; }

    const keyArr = key.split('.');
    let curVal: any = envData;
    for (const keyItem of keyArr) {
        if (keyItem in curVal) {
            curVal = curVal[keyItem];
        } else {
            return defaultValue;
        }
    }

    return clone(curVal);
}

function getBool(key: string, defaultValue?: boolean) {
    return !!get(key, defaultValue);
}

function getNumber(key: string, defaultValue?: number) {
    return parseFloat(get(key, defaultValue));
}

function getString(key: string, defaultValue?: string) {
    const res = get(key, defaultValue);
    return typeof res === 'object' ? JSON.stringify(res) : get(key, defaultValue) + '';
}

export const env = {
    get, getBool, getNumber, getString
};

export default env;