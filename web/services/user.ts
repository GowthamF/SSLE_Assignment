import api from "~/lib/api";

export const login = async (username: string, password: string) => {
  const loginResponse = await api.post<{
    token: string;
    userId: number;
    roles: string[];
  }>("/Account/Token", {
    username,
    password,
  });

  return loginResponse.data;
};
