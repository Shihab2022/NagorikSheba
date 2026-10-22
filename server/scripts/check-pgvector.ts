import { pool } from "../src/utils/pg";

async function main() {
  try {
    const result = await pool.query(`
    SELECT
        EXISTS (
            SELECT 1
            FROM pg_extension
            WHERE extname = 'vector'
        ) AS vector_installed,

        EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'service_embeddings'
        ) AS embeddings_table_exists;
`);

    console.log("RAG database status:", result.rows[0]);
  } catch (error) {
    console.error("Failed to check pgvector:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
