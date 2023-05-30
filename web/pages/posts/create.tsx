import clsx from "clsx";
import Head from "next/head";
import type { FC } from "react";
import type { Post } from "~/prisma";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PostSchema, type PostInput } from "~/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { localApi } from "~/lib/api";

const CreatePost: FC = () => {
  const router = useRouter();

  const savePostMutation = useMutation({
    mutationFn: async (formData: PostInput) => {
      const response = await localApi.post<Post>("/posts", formData);

      return response.data;
    },
    onSuccess: (data) => {
      router.replace(`/posts/${data.id}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(PostSchema),
  });
  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    await savePostMutation.mutateAsync(data);
  };

  return (
    <div>
      <Head>
        <title>Create New Post</title>
      </Head>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text">Title</span>
          </label>

          <input
            {...register("title")}
            type="text"
            className={clsx(
              "input-bordered input w-full max-w-md",
              errors.title ? "input-error" : null
            )}
            disabled={savePostMutation.isLoading}
          />

          {!!errors?.title && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.title?.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text">Content</span>
          </label>

          <textarea
            {...register("content")}
            className={clsx(
              "textarea-bordered textarea w-full max-w-md",
              errors.content ? "input-error" : null
            )}
            disabled={savePostMutation.isLoading}
          />

          {!!errors?.content && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.content?.message}
              </span>
            </label>
          )}
        </div>

        <button
          type="submit"
          className={clsx("btn", savePostMutation.isLoading ? "loading" : null)}
          disabled={savePostMutation.isLoading}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
