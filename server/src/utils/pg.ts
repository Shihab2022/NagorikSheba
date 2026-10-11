
import { Pool } from 'pg';
import config from '../config';

if (!config.database_url) {
    throw new Error(
        'Database configuration is missing. Set DATABASE_URL or the PG_DB_* variables.',
    );
}

export const pool = new Pool({
    connectionString: config.database_url,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 10,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
});
