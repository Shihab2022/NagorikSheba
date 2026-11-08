import { ingestVerifiedServices } from "../src/app/modules/AI/ai.ingestion";
import { pool } from "../src/utils/pg";


async function main() {
  try {
    const result = await ingestVerifiedServices();

    console.log("RAG ingestion completed:", result);
  } catch (error) {
    console.error("RAG ingestion failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();