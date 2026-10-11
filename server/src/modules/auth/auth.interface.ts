export type UserRole = "ADMIN" | "USER";

export interface RegisterPayload {
  name: string;
  email: string;
  authProviderId: string;
  role: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}
