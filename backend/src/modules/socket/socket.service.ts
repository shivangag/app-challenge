import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class SocketService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,

    ) { }

    async get(key): Promise<any> {
        //console.log(this.gateway.connectedSockets);
        //console.log(connectedSockets);
        return await this.cache.get(key);
    }

    async set(key, value) {
        await this.cache.set(key, value);
    }

    async reset() {
        await this.cache.reset();
    }

    async del(key) {
        await this.cache.del(key);
    }
}
