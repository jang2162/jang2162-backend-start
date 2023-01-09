import {Knex} from 'knex';
import {Disposable, Lifecycle, scoped} from 'tsyringe';
import {getTransaction} from '@/transaction';


@scoped(Lifecycle.ContainerScoped)
export class DatabaseConnectionService implements Disposable {
    private transactionInfo?: { trx: Knex.Transaction, release: (err: boolean) => void};
    private err = false;
    constructor() {}

    async release(){
        if (this.transactionInfo) {
            await this.transactionInfo.release(this.err);
        }
    }

    errorOccurred() {
        this.err = true;
    }

    async getConn() {
        if (!this.transactionInfo) {
            this.transactionInfo = await getTransaction();
        }
        return this.transactionInfo.trx;
    }

    async dispose() {
        await this.release()
    }
}


