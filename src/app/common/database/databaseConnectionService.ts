import {Knex} from 'knex';
import {Lifecycle, scoped} from 'tsyringe';
import {getTransaction} from '@/transaction';


@scoped(Lifecycle.ResolutionScoped)
export class DatabaseConnectionService {
    private transactionInfo?: { trx: Knex.Transaction, release: (err: boolean) => void};
    private err = false;
    constructor(
    ) {}

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
}


