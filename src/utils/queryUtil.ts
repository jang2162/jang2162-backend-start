import {Knex} from 'knex';

export function queryBuilder<PARAM_TYPE = undefined, RESULT_TYPE = any> (
    fn: (builder: Knex.QueryBuilder, params?: PARAM_TYPE) => any
) {
    return (trx: Knex.Transaction, params?: PARAM_TYPE): Knex.QueryBuilder<any, RESULT_TYPE[]> => {
        const builder = trx.queryBuilder<any, RESULT_TYPE[]>();
        fn(builder, params);
        return builder;
    }
}

export function queryBuilderFirst<PARAM_TYPE = undefined, RESULT_TYPE = any> (
    fn: (builder: Knex.QueryBuilder, params?: PARAM_TYPE) => any
) {
    return (trx: Knex.Transaction, params?: PARAM_TYPE): Knex.QueryBuilder<any, RESULT_TYPE> => {
        const builder = trx.queryBuilder<any, RESULT_TYPE>();
        fn(builder, params);
        builder.first();
        return builder;
    }
}

const rawQuery = function(arr, ...bindings){
    return {query: arr.join('?'), bindings}
}
export function rawQueryBuilder<PARAM_TYPE = undefined, RESULT_TYPE = any> (
    fn: ( rawQ: typeof rawQuery, params?: PARAM_TYPE) => ReturnType<typeof rawQuery>
) {
    return async (trx: Knex.Transaction, params?: PARAM_TYPE): Promise<RESULT_TYPE[]> => {
        const {query, bindings} = fn(rawQuery, params)
        const {rows} = await trx.raw(query, bindings)
        return rows
    }
}
export function rawQueryBuilderFirst<PARAM_TYPE = undefined, RESULT_TYPE = any> (
    fn: ( rawQ: typeof rawQuery, params?: PARAM_TYPE) => ReturnType<typeof rawQuery>
) {
    return async (trx: Knex.Transaction, params?: PARAM_TYPE): Promise<RESULT_TYPE> => {
        const {query, bindings} = fn(rawQuery, params)
        const {rows} = await trx.raw(query, bindings)
        if (rows && Array.isArray(rows) && rows.length) {
            return rows[0]
        }
        return null
    }
}
