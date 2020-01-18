"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = require("clone");
var fs_1 = require("fs");
var envData = JSON.parse(fs_1.readFileSync(process.env.ENV_PATH || './environments/dev.json', 'utf8').toString());
function get(key, defaultValue) {
    if (!key) {
        return envData;
    }
    var keyArr = key.split('.');
    var curVal = envData;
    for (var _i = 0, keyArr_1 = keyArr; _i < keyArr_1.length; _i++) {
        var itemKey = keyArr_1[_i];
        if (typeof curVal === 'object') {
            var flag = false;
            for (var curKey in curVal) {
                if (curVal.hasOwnProperty(curKey) && itemKey.toLocaleLowerCase() === curKey.toLocaleLowerCase()) {
                    curVal = curVal[curKey];
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                return defaultValue;
            }
        }
        else {
            return defaultValue;
        }
    }
    return clone_1(curVal);
}
function getBool(key, defaultValue) {
    return !!get(key, defaultValue);
}
function getNumber(key, defaultValue) {
    return parseFloat(get(key, defaultValue));
}
function getString(key, defaultValue) {
    var res = get(key, defaultValue);
    return typeof res === 'object' ? JSON.stringify(res) : res + '';
}
exports.env = {
    get: get, getBool: getBool, getNumber: getNumber, getString: getString
};
exports.default = exports.env;
