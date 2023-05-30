import { Roles } from "./schema";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  phoneNumber: string;
  roles: (keyof typeof Roles)[];
}
