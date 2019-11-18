import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
    return knex.schema
        .createTable('sample_user', function (table) {
            table.comment('예제용 사용자 테이블');
            table.increments('id').comment('id');
            table.string('name', 20).notNullable().comment('이름');
            table.date('birthday').comment('생일');
        })
        .createTable('sample_post', function (table) {
            table.comment('예제용 게시글 테이블');
            table.increments('id').comment('id');
            table.integer('writer_id', 100).notNullable().comment('작성자 id');
            table.string('subject', 100).notNullable().comment('제목');
            table.text('content').notNullable().comment('내용');
            table.dateTime('reg_date').defaultTo(knex.fn.now()).comment('작성일');

            table.foreign('writer_id').references('sample_user.id');
        });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTable('sample_post')
        .dropTable('sample_user');
}

