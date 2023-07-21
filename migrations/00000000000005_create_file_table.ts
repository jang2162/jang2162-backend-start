import {Knex} from 'knex';


export async function up(knex: Knex): Promise<any> {
    await knex.schema
        .createTable('tb_cmm_file_group', function (table) {
            table.comment('파일 그룹 테이블');
            table.increments('id').notNullable().comment('id');
            table.string('file_group_key', 32).comment('파일그룹키');
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now()).comment('생성일시');
        }).createTable('tb_cmm_file', function (table) {
            table.comment('파일 테이블');
            table.increments('id').notNullable().comment('id');
            table.integer('file_group_id').notNullable().index().comment('사용자 id');
            table.string('file_key', 32).unique().comment('파일 고유키');

            table.string('file_path', 500).comment('파일 저장 경로');
            table.string('file_name', 200).comment('파일 저장 명');
            table.string('file_original_name', 200).comment('파일 원본 명');
            table.string('file_ext', 32).comment('파일 확장자');

            table.bigInteger('file_size').unsigned().notNullable().comment('파일 크기');
            table.integer('ord_num').unsigned().notNullable().comment('순서');

            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now()).comment('생성일시');
            table.foreign('file_group_id').references('tb_cmm_file_group.id');
        });
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema
        .dropTable('tb_cmm_file')
        .dropTable('tb_cmm_file_group')
}

