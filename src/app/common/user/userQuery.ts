import { queryBuilderFirst} from '@/utils/queryUtil';


export const selectUser = queryBuilderFirst<{ id?: number, discordUserId?: string }, {id: number, tokenCheckValue: string, discordUserId: string, createdAt: Date}>((query, {discordUserId, id}) => {
    query.from('tb_cmm_user')
        .select('id',
            'token_check_value',
            'discord_user_id',
            'created_at'
    )

    if (id) {
        query.where('id', id)
    }

    if (discordUserId) {
        query.where('discord_user_id', discordUserId)
    }

    if (!id && !discordUserId) {
        query.where('id', null)
    }
});
