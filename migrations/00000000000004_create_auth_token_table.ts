import {Knex} from 'knex';


export async function up(knex: Knex): Promise<any> {
    return knex.schema
        .createTable('tb_cmm_auth_token', function (table) {
            table.comment('권한 토큰 관리 테이블');
            table.integer('user_id').notNullable().comment('사용자 id');
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now()).comment('생성일시');
            table.dateTime('last_date').defaultTo(knex.fn.now()).comment('최종발급일');
            table.string('refresh_key', 32).unique().comment('고유키');
            table.string('access_key', 32).unique().comment('권한토큰 비교키');
            table.string('token_check_value', 30).comment('토큰 체크 값');
            table.integer('disabled').notNullable().defaultTo(0).comment('사용 여부');

            table.foreign('user_id').references('tb_cmm_user.id');
        });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('tb_cmm_auth_token')
}

