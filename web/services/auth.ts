import { externalApi } from "~/lib/api";
import { Roles } from "~/lib/schema";

export const login = async (username: string, password: string) => {
  const loginResponse = await externalApi.post<{
    roles: (keyof typeof Roles)[];
    token: string;
    userId: number;
  }>("/Account/Token", {
    username,
    password,
  });

  return loginResponse.data;
};
