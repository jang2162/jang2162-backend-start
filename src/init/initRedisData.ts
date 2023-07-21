import {redisClient} from '@/redisClient';

await redisClient.set('init', 'HELLO WORLD')
process.exit(0)
