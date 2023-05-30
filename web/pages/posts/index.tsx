import clsx from "clsx";
import useUser from "~/hooks/useUser.hook";
import useCurrentUser from "~/hooks/useCurrentUser.hook";
import usePosts from "~/hooks/usePosts.hook";
import Head from "next/head";
import Link from "next/link";
import type { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { localApi } from "~/lib/api";

const UserDisplay: FC<{ id: number }> = ({ id }) => {
  const { data } = useUser(id);

  return (
    <>
      {data?.firstName ? (
        <Link
          href={`/users/${id}`}
          className="underline underline-offset-4"
        >{`${data?.firstName} ${data?.lastName}`}</Link>
      ) : (
        "-"
      )}
    </>
  );
};

const DeletePostButton: FC<{ id: string }> = ({ id }) => {
  const { refetch } = usePosts();

  const deletePostMutation = useMutation({
    mutationKey: ["post", id, "delete"],
    mutationFn: async () => {
      const response = await localApi.delete(`/posts/${id}`);

      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <button
      className={clsx(
        "btn-error btn",
        deletePostMutation.isLoading ? "loading" : null
      )}
      disabled={deletePostMutation.isLoading}
      onClick={() => deletePostMutation.mutate()}
    >
      Delete Post
    </button>
  );
};

const PostsPage: FC = () => {
  const { data: currentUserData } = useCurrentUser();

  const { data } = usePosts();

  const isAdmin = currentUserData?.roles?.includes("Admin");
  const isUser = currentUserData?.roles?.includes("User");

  return (
    <div>
      <Head>
        <title>Posts</title>
      </Head>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>User</th>
              {(isAdmin || isUser) && <th>Delete</th>}
            </tr>
          </thead>

          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link
                    href={`/posts/${item.id}`}
                    className="underline underline-offset-4"
                  >
                    {item.id}
                  </Link>
                </td>
                <td>{item.title}</td>
                <td>
                  <UserDisplay id={item.userId} />
                </td>

                {(isAdmin || isUser) && (
                  <td>
                    {(isAdmin ||
                      (isUser && item.userId === currentUserData?.id)) && (
                      <DeletePostButton id={item.id} />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsPage;
