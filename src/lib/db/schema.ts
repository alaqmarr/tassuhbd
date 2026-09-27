import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const memories = sqliteTable('memories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date').notNull(), // ISO date string
  emoji: text('emoji'),
  photos: text('photos').default('[]'), // JSON array of photo paths
  order: integer('order').notNull().default(0),
  type: text('type', { enum: ['milestone', 'photo', 'letter', 'quote'] }).notNull().default('milestone'),
  quote: text('quote'),
  showInJournal: integer('show_in_journal', { mode: 'boolean' }).notNull().default(true),
  showInTimeline: integer('show_in_timeline', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // UUID
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent'),
  startedAt: text('started_at').notNull().$defaultFn(() => new Date().toISOString()),
  lastActiveAt: text('last_active_at'),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
});

export const pageViews = sqliteTable('page_views', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  pagePath: text('page_path').notNull(),
  enteredAt: text('entered_at').notNull(),
  exitedAt: text('exited_at'),
  durationMs: integer('duration_ms'),
  isReplay: integer('is_replay', { mode: 'boolean' }).notNull().default(false),
  replayCount: integer('replay_count').notNull().default(0),
});

export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value'),
});

export const adminUsers = sqliteTable('admin_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

import { relations } from 'drizzle-orm';

export const sessionsRelations = relations(sessions, ({ many }) => ({
  pageViews: many(pageViews),
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  session: one(sessions, {
    fields: [pageViews.sessionId],
    references: [sessions.id],
  }),
}));
