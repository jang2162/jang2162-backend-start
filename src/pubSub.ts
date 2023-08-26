import { RedisPubSub } from 'graphql-redis-subscriptions';
import { connectRedisClient } from '@/redisClient';
export const pubsub = new RedisPubSub({
    publisher: connectRedisClient(),
    subscriber: connectRedisClient(),
});
