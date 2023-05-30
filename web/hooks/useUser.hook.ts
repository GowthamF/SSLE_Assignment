import useToken from "./useToken.hook";
import type { User } from "~/lib/types";
import { useQuery } from "@tanstack/react-query";
import { externalApi } from "~/lib/api";

const useUser = (id?: number) => {
  const [token] = useToken();

  return useQuery({
    queryKey: ["user", id, { token }],
    queryFn: async () => {
      const response = await externalApi.post<User>(
        "/Account/GetUserById",
        {
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    enabled: !!token && !!id,
  });
};

export default useUser;
