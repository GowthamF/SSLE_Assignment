import clsx from "clsx";
import useToken from "~/hooks/useToken.hook";
import Head from "next/head";
import type { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { LoginSchema, type LoginInput } from "~/lib/schema";
import { login } from "~/services/auth";

const LoginPage: FC = () => {
  const router = useRouter();
  const [token, setToken] = useToken();

  const loginMutation = useMutation({
    mutationFn: async (formData: LoginInput) => {
      return await login(formData.username, formData.password);
    },
    onSuccess: (data) => {
      setToken(data.token);
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
