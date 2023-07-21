import { createClient } from 'redis';
import {Env} from '@/env';
import {createLogger, loggerEnvUtil} from '@/utils/createLogger';

const redisLogger = createLogger('REDIS', {
    ...loggerEnvUtil(
        Env.LOG_REDIS_ERROR_LEVEL,
        Env.LOG_REDIS_ERROR_CONSOLE_LEVEL,
        Env.LOG_REDIS_ERROR_FILE_LEVEL,
        Env.LOG_REDIS_ERROR_FILE_DIR
    )
});

const client = createClient({
    url: Env.REDIS_URL
});

client.on('error', err => redisLogger.error(err));

// await client.connect();

export const redisClient = client;
