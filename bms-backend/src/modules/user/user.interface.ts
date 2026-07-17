export interface IUser {
  _id?: string;
  name: string;
  email: string;
  mobile?: number;
  role: "admin" | "user";
  activateUser?: boolean;
}
