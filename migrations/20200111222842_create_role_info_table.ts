import {Knex}from 'knex';


export async function up(knex: Knex): Promise<any> {
    await knex.schema
        .createTable('role_info', function (table) {
            table.comment('권한정보 테이블');
            table.increments('id').notNullable().comment('id');
            table.string('name', 20).notNullable().comment('권한명');
            table.dateTime('create_date').notNullable().defaultTo(knex.fn.now()).comment('생성일');
        });

    await knex('role_info').insert([
        {name:'ROLE_ADMIN'},
        {name:'ROLE_USER'},
    ])
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('role_info');
}

