/**
 * Database client — server-side only.
 * Import this only in Route Handlers, Server Components, or Server Actions.
 * Never import in client components.
 */
export { db, pool } from "@workspace/db";
export * from "@workspace/db";
