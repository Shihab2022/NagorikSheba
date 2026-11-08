import fs from 'fs';
import path from 'path';
import config from '../config';
import type { runner as RunnerType } from 'node-pg-migrate'; // type-only, erased at compile time

// Stops TypeScript from turning import() into require() when compiling to CommonJS
const dynamicImport = new Function('specifier', 'return import(specifier)') as (
    specifier: string,
) => Promise<{ runner: typeof RunnerType }>;

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

    // Load the ESM-only package lazily, at the moment migrations actually run
    const { runner } = await dynamicImport('node-pg-migrate');

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