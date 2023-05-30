import useToken from "./useToken.hook";
import type { User } from "~/lib/types";
import { useQuery } from "@tanstack/react-query";
import { externalApi } from "~/lib/api";

const useCurrentUser = () => {
  const [token] = useToken();

  const query = useQuery({
    queryKey: ["user", "current", { token }],
    queryFn: async () => {
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
    },
    enabled: !!token,
  });

  return query;
};

export default useCurrentUser;
