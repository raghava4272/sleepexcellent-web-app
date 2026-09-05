import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function createConnection(connectionString: string) {
  const client = postgres(connectionString, { prepare: false, max: 1 });
  return { client, database: drizzle(client, { schema }) };
}

type Connection = ReturnType<typeof createConnection>;
type Database = Connection["database"];
type PostgresClient = Connection["client"];
const databaseGlobal = globalThis as typeof globalThis & {
  sleepExcellentDatabase?: Database;
  sleepExcellentPostgresClient?: PostgresClient;
};

/**
 * Creates the canonical Drizzle connection for trusted server and CLI callers.
 * The application-facing entry point in db/index.ts adds Next.js's server-only
 * guard; standalone maintenance scripts import this module directly.
 */
export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (!databaseGlobal.sleepExcellentDatabase) {
    const connection = createConnection(connectionString);
    databaseGlobal.sleepExcellentPostgresClient = connection.client;
    databaseGlobal.sleepExcellentDatabase = connection.database;
  }
  return databaseGlobal.sleepExcellentDatabase;
}

/** Releases the shared connection only for trusted short-lived CLI processes. */
export async function closeDb() {
  if (databaseGlobal.sleepExcellentPostgresClient) await databaseGlobal.sleepExcellentPostgresClient.end();
  delete databaseGlobal.sleepExcellentDatabase;
  delete databaseGlobal.sleepExcellentPostgresClient;
}
