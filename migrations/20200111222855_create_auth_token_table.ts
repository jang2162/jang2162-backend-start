import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
    return knex.schema
        .createTable('auth_token', function (table) {
            table.comment('권한 토큰 관리 테이블');
            table.integer('user_id').notNullable().comment('사용자 id');
            table.dateTime('create_date').defaultTo(knex.fn.now()).comment('생성일');
            table.dateTime('last_date').defaultTo(knex.fn.now()).comment('최종발급일');
            table.string('refresh_key', 32).unique().comment('고유키');
            table.string('access_key', 32).comment('권한토큰 비교키');
            table.string('salt', 22).comment('salt');
            table.foreign('user_id').references('user.id');
        });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('auth_token')
}

