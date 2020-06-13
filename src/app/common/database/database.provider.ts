import {DatabaseTransactionProvider} from '@/app/common/database/database.transaction.provider';
import {OnRequest, OnResponse} from '@graphql-modules/core';
import {Inject, Injectable, ProviderScope} from '@graphql-modules/di';
import {ApolloError} from 'apollo-server-errors';
import Knex from 'knex';


@Injectable({
    scope: ProviderScope.Session
})
export class DatabaseProvider implements OnRequest, OnResponse {
    readonly knex: Knex;
    private transactionInfo?: { trx: Knex.Transaction, release: (err: boolean) => void};
    private err = false;
    constructor(
        @Inject(DatabaseTransactionProvider) private databaseTransactionProvider: DatabaseTransactionProvider,
    ) {
        this.knex = databaseTransactionProvider.knex;
    }

    async onRequest() {
        this.transactionInfo = await this.databaseTransactionProvider.getTransaction();
    }

    async onResponse(){
        if (this.transactionInfo) {
            await this.transactionInfo.release(this.err);
        } else {
            throw new ApolloError('DatabaseProviderError');
        }
    }

    setError(error: boolean) {
        this.err = error;
    }

    getConn() {
        if (this.transactionInfo) {
            return this.transactionInfo.trx;
        }
        throw new ApolloError('DatabaseProviderError');
    }

}