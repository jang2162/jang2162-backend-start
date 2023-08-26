import {Knex} from 'knex';


export async function up(knex: Knex): Promise<any> {
    await knex.schema
        .createTable('tb_cmm_user_role', function (table) {
            table.comment('사용자 권한 테이블');
            table.integer('user_id').notNullable().comment('사용자 id');
            table.integer('role_id').notNullable().comment('권한 id');
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now()).comment('생성일시');

            table.foreign('user_id').references('tb_cmm_user.id');
            table.foreign('role_id').references('tb_cmm_role_info.id');
        });
    await knex('tb_cmm_user_role').insert([
        {
            user_id: 1,
            role_id: 1,
        },
    ])
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('tb_cmm_user_role')
}

