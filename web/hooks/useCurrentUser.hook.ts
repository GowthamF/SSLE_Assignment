import useToken from "./useToken.hook";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { destroyCookie } from "nookies";
import { TOKEN_KEY } from "~/lib/constants";
import { validateToken } from "~/services/auth";

const useCurrentUser = () => {
  const [token] = useToken();

  const query = useQuery({
    queryKey: ["user", "current", { token }],
    queryFn: async () => {
      return await validateToken(token);
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
