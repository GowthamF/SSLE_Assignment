import { externalApi } from "~/lib/api";
import { Roles } from "~/lib/schema";
import type { User } from "~/lib/types";

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

export const validateToken = async (token: string) => {
  const response = await externalApi.post<User>(
    "/Account/ValidateToken",
    {
      token,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
