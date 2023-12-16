import pg, { PoolClient } from "pg";

const pool = new pg.Pool({
  // user: "...",
  // host: "...",
  // database: "notes",
  // password: "...",
  port: 5432,
});

export async function setupDb(): Promise<PoolClient> {
  try {
    const client = await pool.connect();
    console.log("Connected to database");
    return client;
  } catch (error) {
    console.error("Error fetching notes from database", error);
    throw error;
  }
}

export { pool };
