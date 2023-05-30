import useToken from "./useToken.hook";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { validateToken } from "~/services/auth";

const useCurrentUser = () => {
  const [token, _, removeToken] = useToken();

  const query = useQuery({
    queryKey: ["user", "current", { token }],
    queryFn: async () => {
      return await validateToken(token);
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (query.isError) {
      removeToken();
    }
  }, [query.isError,removeToken]);

  return query;
};

export default useCurrentUser;
