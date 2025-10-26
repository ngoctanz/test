/**
 * User role types
 */
export type UserRole = "ADMIN" | "USER";

/**
 * User status types
 */

/**
 * User interface - Main structure for users
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  balance: number;
  createdAt: string;
  lastLogin?: string;
}
