import { isNull } from 'drizzle-orm'

export function withActive<T extends { deletedAt: unknown }>(table: T) {
  return isNull(table.deletedAt as Parameters<typeof isNull>[0])
}
