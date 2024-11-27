import { users } from '../../db/schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}
