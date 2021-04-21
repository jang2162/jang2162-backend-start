import {Knex} from 'knex';

export function  queryBuilder<PARAM_TYPE = undefined, RESULT_TYPE = any> (
    fn: (builder: Knex.QueryBuilder, params: PARAM_TYPE) => any
) {
    return (trx: Knex.Transaction, params: PARAM_TYPE): Knex.QueryBuilder<any, RESULT_TYPE[]> => {
        const builder = trx.queryBuilder<any, RESULT_TYPE[]>();
        fn(builder, params);
        return builder;
    }
}

export function queryBuilderFirst<PARAM_TYPE = undefined, RESULT_TYPE = any> (
    fn: (builder: Knex.QueryBuilder, params: PARAM_TYPE) => any
) {
    return (trx: Knex.Transaction, params: PARAM_TYPE): Knex.QueryBuilder<any, RESULT_TYPE> => {
        const builder = trx.queryBuilder<any, RESULT_TYPE>();
        fn(builder, params);
        builder.first();
        return builder;
    }
}
