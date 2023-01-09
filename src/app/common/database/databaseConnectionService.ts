import {Request} from 'express';
import {Knex} from 'knex';
import {inject, Lifecycle, scoped} from 'tsyringe';
import {getTransaction} from '@/transaction';
import {OnDestroy, REQUEST} from '@/utils/gqlAppBuilder';


@scoped(Lifecycle.ContainerScoped)
export class DatabaseConnectionService implements OnDestroy {
    private transactionInfo?: { trx: Knex.Transaction, release: (err: boolean) => void};
    private err = false;
    constructor() {
        console.log(1234234234);
    }

    async onDestroy() {
        if (this.transactionInfo) {
            await this.transactionInfo.release(this.err);
        }
    }



    async release(){
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
    isTransactionExist() {
        return this.transactionInfo.trx;
    }
}


