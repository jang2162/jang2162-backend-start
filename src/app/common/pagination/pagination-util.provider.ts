import {Direction_Type, Maybe, PageInfo, PageInput, Sort_Type} from '@/generated-models';
import {Injectable} from '@graphql-modules/di';
import { Base64 } from 'js-base64';
import Knex from 'knex';

interface PageFullInput {
    cursor: string;
    size: number;
    sortBy: string;
    sort: Sort_Type;
    direction: Direction_Type;
}

@Injectable()
export class PaginationUtilProvider {
    static pageInputCheck(pageInput: Maybe<PageInput>): PageFullInput {
        if (!pageInput) {
            throw Error('pageInput is null');
        }

        if (pageInput.size === null || pageInput.size === undefined) {
            throw Error('pageInput.size is null');
        }

        if (pageInput.sort === null || pageInput.sort === undefined) {
            throw Error('pageInput.sort is null');
        }

        if (pageInput.sortBy === null || pageInput.sortBy === undefined) {
            throw Error('pageInput.sortBy is null');
        }

        if (pageInput.cursor === null || pageInput.cursor === undefined) {
            throw Error('pageInput.cursor is null');
        }

        if (pageInput.direction === null || pageInput.direction === undefined) {
            throw Error('pageInput.direction is null');
        }

        return {
            cursor: pageInput.cursor,
            size: pageInput.size,
            sort: pageInput.sort,
            sortBy: pageInput.sortBy,
            direction: pageInput.direction,
        }
    }

    async getConnection(
        builder: Knex.QueryBuilder,
        pageInput: Maybe<PageInput>,
        cursorCols: Array<[string, number]> = [['id', 10]],
    ): Promise<{ list: any[], pageInfo: PageInfo }>{
        const page = PaginationUtilProvider.pageInputCheck(pageInput);
        const listBuilder = builder.clone();
        const listInfoBuilder = builder.clone();
        const curs = cursorCols.map(value => `LPAD(${value[0]}::VARCHAR, ${value[1]}, '0')`).join('||');
        const pageCursor = Base64.decode(page.cursor);
        const knexRaw = (builder as any).client.raw;

        listBuilder
            .select(knexRaw( `${curs} as curs`))
            .orderBy(cursorCols.map(value => ({
                column: value[0],
                order: page.sort === Sort_Type.Desc ? 'DESC' : 'ASC'
            })))
            .limit(page.size);

        if (page.cursor.length > 0) {
            listBuilder.whereRaw(`${curs} ${
                page.direction === Direction_Type.Next && page.sort === Sort_Type.Desc ||
                page.direction === Direction_Type.Prev && page.sort === Sort_Type.Asc ? '<' : '>'
            } ?`, [pageCursor])
        }

        listInfoBuilder.clearSelect().select(
            knexRaw( `MAX(${curs}) as max`),
            knexRaw( `MIN(${curs}) as min`),
            knexRaw( `COUNT(1) as count`)
        );

        const list = await (new Promise<any[]>((resolve, reject) =>
            listBuilder.then(value => resolve(value)).catch(reason => reject(reason))
        ));

        const listInfo = (await (new Promise<any>((resolve, reject) =>
            listInfoBuilder.then(value => resolve(value)).catch(reason => reject(reason))
        )))[0];

        const next = list.length > 0 ? list[list.length-1].curs : '';
        const prev = list.length > 0 ? list[0].curs : '';
        const hasNext = list.length > 0 &&
            page.sort === Sort_Type.Asc && next !== listInfo.max ||
            page.sort === Sort_Type.Desc && next !== listInfo.min;

        const hasPrev = list.length > 0 &&
            page.sort === Sort_Type.Asc && prev !== listInfo.min ||
            page.sort === Sort_Type.Desc && prev !== listInfo.max;

        return {
            list,
            pageInfo: {
                totalCount: listInfo.count,
                next: hasNext ? Base64.encode(next) : null,
                prev: hasPrev ? Base64.encode(prev) : null,
                hasNext,
                hasPrev,
                sortBy: page.sortBy,
                sort:page.sort,
                direction: page.direction,
            }
        }
    }
}