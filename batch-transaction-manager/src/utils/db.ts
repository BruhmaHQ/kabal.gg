import { Pool } from "pg";
import config from "../config/config";

let pool: Pool;
const initializePool = async () => {
  const poolConfig = {
    user: config.pg.user,
    host: config.pg.host,
    database: config.pg.database,
    password: config.pg.password,
    port: config.pg.port,
    max: 10,
    min: 6,
    statement_timeout: 120000,
    idleTimeoutMillis: 1000,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  const newPool = new Pool(poolConfig);
  return newPool;
};

export const db = async () => {
  if (!pool) {
    pool = await initializePool();
  }

  return { pool };
};
