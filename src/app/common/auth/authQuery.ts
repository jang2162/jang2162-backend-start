import {knexClient} from '@/transaction';
import { queryBuilder, queryBuilderFirst} from '@/utils/queryUtil';


export const selectRoles = queryBuilder((query) =>
    query.from('tb_cmm_auth_token')
);

export const insertAuthToken = queryBuilder<
    {
        userId: number,
        refreshKey: string,
        accessKey: string,
        tokenCheckValue: string,
    }
>((query, {userId, refreshKey, accessKey, tokenCheckValue}) =>
    query.from('tb_cmm_auth_token').insert({
        user_id: userId,
        refresh_key: refreshKey,
        access_key: accessKey,
        token_check_value: tokenCheckValue,
    })
);

export const selectRoleByUserId = queryBuilder<
    {userId: number},
    {roleId: string}
>((query, {userId}) =>
    query.from('tb_cmm_user_role').where('user_id', userId)
);

export const selectAuthData = queryBuilderFirst<
    {
        refreshKey: string
    },
    {
        userId: number,
        refreshInterval: number,
        accessKey: string,
        tokenCheckValue: string
    }
>((builder, {refreshKey}) =>
    builder.from('tb_cmm_auth_token').select(
        'user_id',
        knexClient.raw('EXTRACT(epoch FROM (NOW() - last_date))::int refresh_interval'),
        'access_key',
        'token_check_string'
    ).where('refresh_key', refreshKey)
        .where('disabled', 0))


export const invalidateToken = queryBuilder<
    {
        accessKey?: string,
        refreshKey?: string,
    }
>((builder, {accessKey, refreshKey}) => {
    builder.from('tb_cmm_auth_token').update({
        disabled: 1
    });

    if (accessKey) {
        builder.where('access_key', accessKey)
    }

    if (refreshKey) {
        builder.where('refresh_key', refreshKey)
    }
});

export const renewAccessKey = queryBuilder<
    {
        accessKey: string,
        refreshKey: string,
    }
>((builder, {refreshKey, accessKey }) =>
    builder.from('tb_cmm_auth_token').update({
        access_key: accessKey,
        last_date: knexClient.fn.now()
    }).where('refresh_key', refreshKey)
)
