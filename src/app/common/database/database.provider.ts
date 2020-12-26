import {DatabaseTransactionProvider} from '@/app/common/database/database.transaction.provider';
import {ApolloError} from 'apollo-server-errors';
import {Inject, Injectable, Scope, OnDestroy, Middleware} from 'graphql-modules';
import Knex from 'knex';


@Injectable({
    scope: Scope.Operation,
    global: true
})
export class DatabaseProvider implements OnDestroy {
    readonly knex: Knex;
    private transactionInfo?: { trx: Knex.Transaction, release: (err: boolean) => void};
    private err = false;
    constructor(
        @Inject(DatabaseTransactionProvider) private databaseTransactionProvider: DatabaseTransactionProvider,
    ) {
        this.knex = databaseTransactionProvider.knex;
    }

    async init() {
        this.transactionInfo = await this.databaseTransactionProvider.getTransaction();
    }

    async onDestroy(){
        if (this.transactionInfo) {
            await this.transactionInfo.release(this.err);
        } else {
            throw new ApolloError('DatabaseProviderError');
        }
    }

    setError(error: boolean) {
        this.err = error;
    }

    async getConn() {
        if (this.transactionInfo) {
            return this.transactionInfo.trx;
        }
        throw new ApolloError('DatabaseProviderError');
    }
}


