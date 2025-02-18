import type { User } from './schema';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

export type SessionUser = Pick<User, 'id' | 'email' | 'name'>;
