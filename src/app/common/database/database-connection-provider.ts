import {getTransaction} from '@/transaction';
import {Injectable, Scope, OnDestroy} from 'graphql-modules';
import {Knex} from 'knex';


@Injectable({
    scope: Scope.Operation,
    global: true
})
export class DatabaseConnectionProvider implements OnDestroy {
    private transactionInfo?: { trx: Knex.Transaction, release: (err: boolean) => void};
    private err = false;
    constructor(
    ) {}

    async onDestroy(){
        if (this.transactionInfo) {
            await this.transactionInfo.release(this.err);
        }
    }

    setError(error: boolean) {
        this.err = error;
    }

    async getConn() {
        if (!this.transactionInfo) {
            this.transactionInfo = await getTransaction();
        }
        return this.transactionInfo.trx;
    }
}


