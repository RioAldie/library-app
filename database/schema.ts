import {
  integer,
  text,
  boolean,
  pgTable,
  uuid,
  varchar,
  pgEnum,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';

export const STATUS_ENUM = pgEnum('status', [
  'PENDING',
  'APPROVED',
  'REJECTED',
]);
export const ROLE_ENUM = pgEnum('role', [
  'USER',
  'ADMIN',
  'SUPER_ADMIN',
]);
export const BOOK_ENUM = pgEnum('borror_status', [
  'BORROWED',
  'RETURNED',
]);

export const users = pgTable('users', {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email').notNull().unique(),
  universityId: integer('university_id').notNull().unique(),
  password: text('password').notNull(),
  universityCard: text('university_card').notNull(),
  status: STATUS_ENUM('status').default('PENDING'),
  role: ROLE_ENUM('role').default('USER'),
  lastActivityDate: date('last_activity_date').defaultNow(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
});