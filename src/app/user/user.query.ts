import {ProductSearchInput, User, UserConnection, UserInput, UserSearchInput} from '@/generated-models';
import {cursorPaginationConnectionBuilder, SortType} from '@/utils/paginationUtil';
import {queryBuilder, queryBuilderFirst} from '@/utils/queryUtil';


export const getUserListBatch = queryBuilder<
    {idArr: readonly string[]},
    {id: number, password: string}
>((builder, params) =>
    builder.from('user')
        .select('id', 'login_id', 'name', 'birthday', 'create_date')
        .whereIn('id', params.idArr)
);

export const getUserByLoginId = queryBuilderFirst<
    {loginId: string},
    {id: number, password: string}
>((builder, params) =>
    builder.from('user')
        .select('id', 'password')
        .where('login_id', params.loginId)
);

export const insertUser = queryBuilder<
    {user: UserInput},
    User
>((builder, params) =>
    builder.from('user').insert({
        name: params.user.name,
        login_id: params.user.loginId,
        password: params.user.password,
        birthday: params.user.birthday
    }, ['id', 'login_id', 'name', 'birthday', 'create_date'])
);

export const userAddRole = queryBuilder<
    {userId: string, roleId: number}
>((builder, {userId, roleId}) =>
    builder.from('user_role').insert({
        user_id: userId,
        role_id: roleId
    })
);

export const getUserConnection = cursorPaginationConnectionBuilder<UserSearchInput>(
    {
        'id': 'AA.ID',
        'price': 'AC.PRICE',
    },
    [
        'price',
        ['id', SortType.DESC],
    ],
    (builder, searchInput) => {
        builder.from('user a')
            .select(
                'a.id',
                'a.login_id',
                'a.name',
                'a.email',
                'a.birthday',
            );

        if (searchInput?.searchLoginId) {
            builder.where('a.login_id', 'like', `%${searchInput.searchLoginId}%`);
        }

        if (searchInput?.searchName) {
            builder.where('a.name', 'like', `%${searchInput.searchName}%`);
        }
    }
);
