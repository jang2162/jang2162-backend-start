import { Redis } from 'ioredis';
import { Env } from '@/env';
import { createLogger, loggerEnvUtil } from '@/utils/createLogger';

const redisLogger = createLogger<Error>('REDIS', {
    ...loggerEnvUtil(
        Env.LOG_REDIS_ERROR_LEVEL,
        Env.LOG_REDIS_ERROR_CONSOLE_LEVEL,
        Env.LOG_REDIS_ERROR_FILE_LEVEL,
        Env.LOG_REDIS_ERROR_FILE_DIR,
    ),
});

export function connectRedisClient() {
    const client = new Redis(Env.REDIS_PORT, Env.REDIS_HOST, {
        retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
        },
    });
    client.on('error', (err) => redisLogger.error(err.message, err));
    return client;
}
export const redisClient = connectRedisClient();
