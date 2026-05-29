import { isNull, type SQLWrapper } from 'drizzle-orm'

/**
 * Returns a Drizzle `where` condition that filters out soft-deleted rows.
 * Every SELECT, JOIN, and aggregate on a soft-deletable table must use this.
 * No global filter exists — every query author is responsible.
 *
 * The constraint requires `deletedAt` to be a `SQLWrapper` (i.e. a Drizzle Column),
 * not just `unknown`, so callers get a type error if they pass a table without a
 * proper `deletedAt` column.
 */
export function withActive<T extends { deletedAt: SQLWrapper }>(table: T) {
  return isNull(table.deletedAt)
}
