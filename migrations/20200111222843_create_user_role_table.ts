import {hash} from 'bcrypt';
import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
    await knex.schema
        .createTable('user_role', function (table) {
            table.comment('사용자 권한 테이블');
            table.integer('user_id').notNullable().comment('사용자 id');
            table.integer('role_id').notNullable().comment('권한 id');
            table.dateTime('create_date').defaultTo(knex.fn.now()).comment('생성일');

            table.foreign('user_id').references('user.id');
            table.foreign('role_id').references('role_info.id');
        });
    await knex('user_role').insert([
        {
            user_id: 1,
            role_id: 1,
        },
    ])
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('user_role')
}

