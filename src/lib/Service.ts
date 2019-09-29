import {ClientWrapper, getClient} from '@/lib/db';

export class Service {
    constructor (private client?: ClientWrapper) {}

    async getClient() {
        if (!this.client) {
            this.client = await getClient();
        }
        return this.client;
    }
}
