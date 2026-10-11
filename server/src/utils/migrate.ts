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

    const compiledMigrationsPath = path.resolve(__dirname, '../migrations');
    const sourceMigrationsPath = path.resolve(process.cwd(), 'src/migrations');
    const migrationsPath = fs.existsSync(compiledMigrationsPath)
        ? compiledMigrationsPath
        : sourceMigrationsPath;

    await runner({
        databaseUrl: config.database_url,
        dir: migrationsPath,
        direction: 'up',
        migrationsTable: 'pgmigrations',
        verbose: true,
    });

    console.log('Migrations completed successfully');
}
