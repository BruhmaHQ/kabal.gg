import { db } from "./db";

export const executeQuery = async (
  query: string,
  values?: any,
  isTransaction = false
) => {
  const pool = await db();
  const client = await pool.pool.connect();

  try {
    if (isTransaction) await client.query("BEGIN");
    const result = await client.query(query, values);
    if (isTransaction) await client.query("COMMIT");
    return result.rows;
  } catch (e: any) {
    if (isTransaction) await client.query("ROLLBACK");
    throw new Error(`Error executing query: ${query} - ${e?.message}`);
  } finally {
    client.release();
  }
};
