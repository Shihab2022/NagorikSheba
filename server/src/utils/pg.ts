
import { Pool } from 'pg';
import config from '../config';

if (!config.database_url) {
    throw new Error(
        'Database configuration is missing. Set DATABASE_URL or the PG_DB_* variables.',
    );
}

// Enable SSL for remote/managed databases. Local databases (localhost/127.0.0.1)
// typically don't support SSL, and forcing it breaks local development.
const isLocalDatabase =
    /@(localhost|127\.0\.0\.1|\[::1\])/i.test(config.database_url) ||
    process.env.DB_SSL === 'false';

const ssl = isLocalDatabase
    ? false
    : { rejectUnauthorized: false };

export const pool = new Pool({
    connectionString: config.database_url,
    ssl,
    max: 10,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
});

