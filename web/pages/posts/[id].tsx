import useUser from "~/hooks/useUser.hook";
import Head from "next/head";
import Link from "next/link";
import type { FC } from "react";
import type { Post } from "~/prisma";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { localApi } from "~/lib/api";
import { formatDate } from "~/lib/helpers";

const PostPage: FC = () => {
  const router = useRouter();

  const id = router.query.id?.toString();

  const { data } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await localApi.get<Post>(`/posts/${id}`);

      return response.data;
    },
    enabled: !!id,
  });

  const { data: userData } = useUser(data?.userId);

  return (
    <div>
      <Head>
        <title>{`Post: ${data?.title ?? id}`}</title>
      </Head>

      {!!data && (
        <>
          <h1 className="mb-5 text-2xl font-medium">{data?.title}</h1>

          {!!userData && (
            <div className="mb-2">
              Created by:{" "}
              <Link
                href={`/users/${data?.userId}`}
                className="underline underline-offset-4"
              >{`${userData?.firstName} ${userData?.lastName}`}</Link>
            </div>
          )}

          <div className="mb-2">Created on: {formatDate(data?.createdAt)}</div>

          <p>{data?.content}</p>
        </>
      )}
    </div>
  );
};

export default PostPage;
