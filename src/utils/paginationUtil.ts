import {Base64} from 'js-base64';
import {Knex} from 'knex';
import {CursorPageInput, OffsetPageInput} from '../generated-models';


export enum SortType {
    ASC = 0,
    DESC = 1,
}

const whereCursorPagination = (
    builder: Knex.QueryBuilder,
    columnNameMapper: Record<string, string>,
    idx: number,
    cursorData: Array<[string, any, SortType]>,
    pageDirection: number
) => {
    const item = cursorData[idx];
    if (idx > 0) {
        const prevItem = cursorData[idx-1];
        builder.where(columnNameMapper[prevItem[0]], prevItem[1]);
    }
    builder.where(columnNameMapper[item[0]],
        (item[2] === SortType.ASC && pageDirection === 1) ||
        (item[2] === SortType.DESC && pageDirection !== 0) ? '<' : '>'
        , item[1]);

    if (idx < cursorData.length - 1) {
        builder.orWhere(newBuilder => whereCursorPagination(newBuilder, columnNameMapper,idx+1, cursorData, pageDirection));
    }
}

const getCursor = (
    data:any,
    sortKeyData: Array<[string, SortType]>,
    pageDirection: number
) => {
    return Base64.encode(JSON.stringify({
        d: pageDirection,
        s: sortKeyData.map(item => [item[0], data[item[0]], item[1]])
    }));
}

export function cursorPaginationConnectionBuilder<SEARCH_INPUT = any, LIST_ITEM = any, SORT_INFO = string>(
    columnNameMapper: Record<string, string>,
    sortInfoOrDataOrParser: string | Array<[string, SortType] | string> | ((sortInfo: SORT_INFO) => Array<[string, SortType] | string>),
    queryBuilderFactory: (builder: Knex.QueryBuilder, form?: SEARCH_INPUT | null) => any
) {
    return async (
        trx: Knex.Transaction,
        searchInput?: SEARCH_INPUT | null,
        pageInput?: CursorPageInput | null,
        sortInfo?: SORT_INFO,
    ) => {
        let sortKeyData: Array<[string, SortType]> | null = null;
        let cursorData: Array<[string, any, SortType]> | null = null;
        pageInput = pageInput ?? {};
        const pageSize = pageInput.size ?? 15;
        let pageDirection = 1;
        if (pageInput.cursor) {
            const cursorParse = JSON.parse(Base64.decode(pageInput.cursor));
            cursorData = cursorParse.s;
            pageDirection = cursorParse.d;
        } else if (typeof sortInfoOrDataOrParser === 'string') {
            sortKeyData = [[sortInfoOrDataOrParser, SortType.DESC]]
        } else if (Array.isArray(sortInfoOrDataOrParser)) {
            sortKeyData = sortInfoOrDataOrParser.map(item => Array.isArray(item) ? item : [item, SortType.ASC]);
        } else if (sortInfo) {
            sortKeyData = sortInfoOrDataOrParser(sortInfo).map(item => Array.isArray(item) ? item : [item, SortType.ASC]);
        }

        if (cursorData) {
            sortKeyData = cursorData.map(item => [item[0], item[2]]);
        }

        if (!sortKeyData) {
            throw Error('GET_SORT_KEY_DATA');
        }

        const baseQueryBuilder = trx.queryBuilder<any, LIST_ITEM[]>();
        queryBuilderFactory(baseQueryBuilder, searchInput);

        const listQueryBuilder = baseQueryBuilder.clone().orderBy(sortKeyData.map(value => ({
            column: columnNameMapper[value[0]],
            order: (value[1] === SortType.ASC && pageDirection === 1) ||
            (value[1] === SortType.DESC && pageDirection !== 1) ? 'asc' : 'desc'
        }))).limit(pageSize);

        if (cursorData) {
            whereCursorPagination(listQueryBuilder, columnNameMapper, 0, cursorData, pageDirection)
        }

        const list = await listQueryBuilder;

        if (pageDirection !== 1) {
            list.reverse();
        }

        return {
            list,
            pageInfo: {
                totalCount: await baseQueryBuilder.clone().clear('select').count({cnt: '*'}).first().then(item => (item?.cnt ?? 0) - 0),
                next: list.length ? getCursor(list[list.length - 1], sortKeyData, 1) : null,
                prev: list.length ? getCursor(list[0], sortKeyData, 0) : null,
                hasMore: list.length === pageSize,
            }
        }
    }
}


export function offsetPaginationConnectionBuilder<SEARCH_INPUT = any, LIST_ITEM = any, SORT_INFO = string>(
    columnNameMapper: Record<string, string>,
    sortInfoOrDataOrParser: string | Array<[string, SortType] | string> | ((sortInfo: SORT_INFO) => Array<[string, SortType] | string>),
    queryBuilderFactory: (builder: Knex.QueryBuilder, form?: SEARCH_INPUT | null) => any
) {
    return async (
        trx: Knex.Transaction,
        searchInput?: SEARCH_INPUT | null,
        pageInput?: OffsetPageInput | null,
        sortInfo?: SORT_INFO,
    ) => {
        let sortKeyData: Array<[string, SortType]> | null = null;
        pageInput = pageInput ?? {};
        const pageSize = pageInput.size ?? 15;
        const pageIndex = pageInput.pageIndex ?? 1;
        if (typeof sortInfoOrDataOrParser === 'string') {
            sortKeyData = [[sortInfoOrDataOrParser, SortType.DESC]]
        } else if (Array.isArray(sortInfoOrDataOrParser)) {
            sortKeyData = sortInfoOrDataOrParser.map(item => Array.isArray(item) ? item : [item, SortType.ASC]);
        } else if (sortInfo) {
            sortKeyData = sortInfoOrDataOrParser(sortInfo).map(item => Array.isArray(item) ? item : [item, SortType.ASC]);
        } else {
            throw Error('GET_SORT_KEY_DATA');
        }

        const baseQueryBuilder = trx.queryBuilder<any, LIST_ITEM[]>();
        queryBuilderFactory(baseQueryBuilder, searchInput);

        const listQueryBuilder = baseQueryBuilder.clone().orderBy(sortKeyData.map(value => ({
            column: columnNameMapper[value[0]],
            order: value[1] === SortType.ASC  ? 'asc' : 'desc'
        }))).limit(pageSize).offset((pageIndex - 1) * pageSize );
        const list = await listQueryBuilder;
        return {
            list,
            totalCount: baseQueryBuilder.clone().clear('select').count({cnt: '*'}).first().then(item => (item?.cnt ?? 0) - 0),
        }
    }
}
