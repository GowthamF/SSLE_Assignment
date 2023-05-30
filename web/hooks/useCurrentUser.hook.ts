import useToken from "./useToken.hook";
import type { User } from "~/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { destroyCookie } from "nookies";
import { externalApi } from "~/lib/api";
import { TOKEN_KEY } from "~/lib/constants";

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

  useEffect(() => {
    if (query.isError) {
      destroyCookie(null, TOKEN_KEY);
    }
  }, [query.isError]);

  return query;
};

export default useCurrentUser;
