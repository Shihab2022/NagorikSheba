export type UserRole = "ADMIN" | "USER";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: UserRole;
}



export interface ILoginUser {
  email: string;
  password: string;
}