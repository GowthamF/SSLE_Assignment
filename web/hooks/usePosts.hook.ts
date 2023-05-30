
import type { Post } from "~/prisma";
import { useQuery } from "@tanstack/react-query";
import { localApi } from "~/lib/api";

const usePosts = () => {
return useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const response = await localApi.get<Post[]>("/posts");

      return response.data;
    },
  });
}

export default usePosts;