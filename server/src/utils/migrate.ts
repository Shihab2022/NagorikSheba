import fs from 'fs';
import path from 'path';
import config from '../config';
import { runner } from 'node-pg-migrate';

export async function runMigrations() {
    if (!config.database_url) {
        throw new Error(
            'Database configuration is missing. Set DATABASE_URL or the PG_DB_* variables.',
        );
    }

    // Neon / PgBouncer fix: node-pg-migrate requires direct connection (remove -pooler)
    // because transaction pooler does not support advisory locks. Also remove channel_binding.
    const migrationUrl = config.database_url
        .replace('-pooler.', '.')
        .replace(/([?&])channel_binding=[^&]+(&|$)/, '$1')
        .replace(/[?&]$/, '');

    const compiledMigrationsPath = path.resolve(__dirname, '../migrations');
    const sourceMigrationsPath = path.resolve(process.cwd(), 'src/migrations');
    const migrationsPath = fs.existsSync(compiledMigrationsPath)
        ? compiledMigrationsPath
        : sourceMigrationsPath;

    await runner({
        databaseUrl: migrationUrl,
        dir: migrationsPath,
        direction: 'up',
        migrationsTable: 'pgmigrations',
        verbose: true,
        checkOrder: false,
    });

    console.log('Migrations completed successfully');
}
