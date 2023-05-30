import { z } from "zod";

export const Roles = {
  User: "User",
  Admin: "Admin",
  SuperAdmin: "SuperAdmin",
} as const;

export const RegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(5, { message: "Required" }),
  lastName: z.string().min(5, { message: "Required" }),
  password: z.string().min(5, { message: "Required" }),
  role: z.nativeEnum(Roles),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(5, { message: "Required" }),
});
export type LoginInput = z.infer<typeof LoginSchema>;
