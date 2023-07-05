export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string | null;
  last_name: string | null;
  created_at: Date;
  updated_at: Date;
}

// Type for the user object attached to the request by the auth middleware
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
} 