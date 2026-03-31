export type UserRole =
  | "Admin"
  | "Program Admin"
  | "Researcher"
  | "Partner"
  | "Subscriber";

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  status: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UserWithRole extends UserProfile {
  role: string | null;
  role_id: string | null;
}

export const ROLE_DASHBOARDS: Record<string, string> = {
  "Admin": "/cms/dashboard",
  "Program Admin": "/cms/dashboard",
  "Researcher": "/cms/dashboard",
  "Partner": "/cms/dashboard",
  "Subscriber": "/cms/dashboard",
};
