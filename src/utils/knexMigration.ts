import process from 'process';
import knex from 'knex';
import {Env} from '@/env';
import {createLogger, loggerEnvUtil} from '@/utils/createLogger';

const knexLogger = createLogger('KNEX', {
    ...loggerEnvUtil(
        Env.LOG_KNEX_LEVEL,
        Env.LOG_KNEX_CONSOLE_LEVEL,
        Env.LOG_KNEX_FILE_LEVEL,
        Env.LOG_KNEX_FILE_DIR
    )
});

const knexClient = knex({
    client: 'pg',
    connection: {
        host: Env.DB_HOST,
        port: Env.DB_PORT,
        database: Env.DB_NAME,
        user: Env.DB_USER,
        password: Env.DB_PASSWORD,
    },
    log: {
        warn(message) {
            knexLogger.warn(message);
        },
        error(message) {
            knexLogger.error(message);
        },
        deprecate(message) {
            knexLogger.info(message);
        },
        debug(message) {
            knexLogger.debug(message);
        },
    }
});

const config = {
    directory: '../migrations',
    extension: 'ts'
};
knexLogger.info('\n')
knexLogger.info('\n')
let fg = false;
for (const arg of process.argv) {
    if (!arg.startsWith('knex:')) {
        continue;
    }
    fg = true;
    switch (arg) {
        case 'knex:make':
            {
                const arr = process.argv.slice(process.argv.indexOf(arg)+1);
                if (arr.length === 0) {
                    arr.push('temp_migration')
                }

                for (const name of arr) {
                    knexLogger.info(`Created Migration: ${await knexClient.migrate.make(name, config)}`)
                }
            }
            break;
        case 'knex:latest':
            {
                const [batchNo, log] = await knexClient.migrate.latest(config)
                if (log.length === 0) {
                    knexLogger.info('Already up to date.')
                } else {
                    knexLogger.info(`Batch ${batchNo} run: ${log.length} migrations`)
                    for (const item of log) {
                        knexLogger.info(`\t${item}`)
                    }
                }
            }
            break;
        case 'knex:rollback':
            {
                const [batchNo, log] = await knexClient.migrate.rollback(config)
                if (batchNo === 0) {
                    knexLogger.info('Already at the base migration.')
                } else {
                    knexLogger.info(`Batch ${batchNo} rolled back: ${log.length} migrations`)
                    for (const item of log) {
                        knexLogger.info(`\t${item}`)
                    }
                }
            }
            break;
        case 'knex:rollbackAll':
            await knexClient.migrate.rollback(config, true)
            knexLogger.info('All migrations have been rolled back.')
            break;
        case 'knex:up':
            {
                const [batchNo, log] = await knexClient.migrate.up(config)
                if (log.length === 0) {
                    knexLogger.info('Already up to date.')
                } else {
                    knexLogger.info(`Batch ${batchNo} ran the following migrations:`)
                    for (const item of log) {
                        knexLogger.info(`\t${item}`)
                    }
                }
            }
            break;
        case 'knex:down':
            {
                const [batchNo, log] = await knexClient.migrate.down(config)
                if (batchNo === 0) {
                    knexLogger.info('Already at the base migration.')
                } else {
                    knexLogger.info(`Batch ${batchNo} rolled back the following migrations:`)
                    for (const item of log) {
                        knexLogger.info(`\t${item}`)
                    }
                }
            }
            break;
        case 'knex:currentVersion':
            knexLogger.info(`Current Version: '${await knexClient.migrate.currentVersion(config)}'`)
            break;
        case 'knex:list':
            {
                const [completed, newMigrations] = await knexClient.migrate.list(config);
                if (completed.length === 0) {
                    knexLogger.info('No Completed Migration files Found.')
                } else {
                    knexLogger.info(`Found ${completed.length} Completed Migration file/files.`)
                    for (const item of completed) {
                        knexLogger.info(`\t${item.name}`)
                    }
                }

                knexLogger.info('\n')
                if (newMigrations.length === 0) {
                    knexLogger.info('No Pending Migration files Found.')
                } else {
                    knexLogger.info(`Found ${newMigrations.length} Pending Migration file/files.`)
                    for (const item of newMigrations) {
                        knexLogger.info(`\t${item.file}`)
                    }
                }
            }
            break;
        case 'knex:unlock':
            await knexClient.migrate.forceFreeMigrationsLock(config)
            knexLogger.info('Succesfully unlocked the migrations lock table')
            break;
        default:
            knexLogger.error(`Cannot find ${arg} command..`);
            break
    }

}

if (!fg) {
    knexLogger.error('Cannot find any knex migration command..');
}

knexLogger.info('\n')
knexLogger.info('\n')

process.exit()
