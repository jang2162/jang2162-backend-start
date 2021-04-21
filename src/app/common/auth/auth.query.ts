import {knexClient} from '@/transaction';
import { queryBuilder, queryBuilderFirst} from '@/utils/queryUtil';


export const insertAuthToken = queryBuilder<
    {
        userId: number,
        refreshKey: string,
        accessKey: string,
        salt: string,
    }
>((query, {userId, refreshKey, accessKey, salt}) =>
    query.from('auth_token').insert({
        user_id: userId,
        refresh_key: refreshKey,
        access_key: accessKey,
        salt,
    })
);

export const selectRoleByUserId = queryBuilder<
    {userId: number},
    {roleId: string}
>((query, {userId}) =>
    query.from('user_role').where('user_id', userId)
);

export const selectAuthData = queryBuilderFirst<
    {
        refreshKey: string
    },
    {
        userId: number,
        refreshInterval: number,
        accessKey: string,
        salt: string
    }
>((builder, {refreshKey}) =>
    builder.from('auth_token').select(
        'user_id',
        knexClient.raw('EXTRACT(epoch FROM (NOW() - last_date))::int refresh_interval'),
        'access_key',
        'salt'
    ).where('refresh_key', refreshKey)
        .where('disabled', 0))

export const selectSalt = queryBuilderFirst<
    {userId: number},
    {slat: string}
>((builder, {userId}) =>
    builder.from('user').select(knexClient.raw('SUBSTR(password, 0, 30) salt'))
    .where('id', userId)
);

export const invalidateToken = queryBuilder<
    {
        accessKey?: string,
        refreshKey?: string,
    }
>((builder, {accessKey, refreshKey}) => {
    builder.from('auth_token').update({
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
    builder.from('auth_token').update({
        access_key: accessKey,
        last_date: knexClient.fn.now()
    }).where('refresh_key', refreshKey)
)
