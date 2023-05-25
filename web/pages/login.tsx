import clsx from "clsx";
import useAuthStore from "~/hooks/useAuthStore.hook";
import Head from "next/head";
import type { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { login } from "~/services/user";

const LoginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(5, { message: "Required" }),
});
type LoginInput = z.infer<typeof LoginSchema>;

const LoginPage: FC = () => {
  const router = useRouter();
  const { setUser } = useAuthStore((state) => state.actions);

  const loginMutation = useMutation({
    mutationFn: async (formData: LoginInput) => {
      return await login(formData.username, formData.password);
    },
    onSuccess: (data) => {
      setUser(data.token, data.userId, data.roles);
      router.replace("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });
  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Username</span>
          </label>

          <input
            {...register("username")}
            type="email"
            className={clsx(
              "input-bordered input w-full max-w-xs",
              errors.username ? "input-error" : null
            )}
            disabled={loginMutation.isLoading}
          />

          {!!errors?.username && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.username?.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Password</span>
          </label>

          <input
            {...register("password")}
            type="password"
            className={clsx(
              "input-bordered input w-full max-w-xs",
              errors.password ? "input-error" : null
            )}
            disabled={loginMutation.isLoading}
          />

          {!!errors?.password && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.password?.message}
              </span>
            </label>
          )}
        </div>

        <button
          type="submit"
          className={clsx("btn", loginMutation.isLoading ? "loading" : null)}
          disabled={loginMutation.isLoading}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
