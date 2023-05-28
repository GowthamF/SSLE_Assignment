import api from "~/lib/api";
import useAuthStore from "./useAuthStore.hook";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "~/prisma";

const useCurrentUser = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const { setIsAuth } = useAuthStore((state) => state.actions);
  const actions = useAuthStore((state) => state.actions);

  const query = useQuery({
    queryKey: ["user", "current", isAuth],
    queryFn: async () => {
      const response = await api.post<Omit<User, "password">>(
        "/auth/current-user"
      );

      return response.data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      setIsAuth(false);
    } else {
      console.log("> setIsAuth: ", actions);
      setIsAuth(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isError]);

  return query;
};

export default useCurrentUser;
