import { pgTable, uuid, text, boolean, timestamp, varchar } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // FK to auth.users.id — set by trigger
  email: text('email').notNull(),
  username: varchar('username', { length: 30 }).unique(),
  usernameChangedAt: timestamp('username_changed_at', { withTimezone: true }),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  premiumUntil: timestamp('premium_until', { withTimezone: true }),
  isAdmin: boolean('is_admin').default(false).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
