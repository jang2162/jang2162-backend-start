export declare function get(key?: string, defaultValue?: any): any;
export declare function getBool(key: string, defaultValue?: boolean): boolean;
export declare function getNumber(key: string, defaultValue?: number): number;
export declare function getString(key: string, defaultValue?: string): string;
export declare const env: {
    get: typeof get;
    getBool: typeof getBool;
    getNumber: typeof getNumber;
    getString: typeof getString;
};
export default env;
