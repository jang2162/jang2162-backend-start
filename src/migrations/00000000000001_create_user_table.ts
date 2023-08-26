import {hash} from 'bcrypt';
import {Knex} from 'knex';


export async function up(knex: Knex): Promise<any> {
    await knex.schema
        .createTable('tb_cmm_user', function (table) {
            table.comment('사용자 테이블');
            table.increments('id').notNullable().comment('id');
            table.string('login_id', 20).unique().notNullable().comment('로그인 아이디');
            table.string('password', 60).notNullable().comment('비밀번호');
            table.string('name', 20).notNullable().comment('이름');
            table.date('birthday').comment('생일');
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now()).comment('생성일시');
        });
    await knex('tb_cmm_user').insert([
        {
            id: 1,
            name: '관리자',
            login_id: 'admin',
            password: await hash('admin', 10),
            birthday: '1970-01-01',
        },
    ])
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('tb_cmm_user');
}

