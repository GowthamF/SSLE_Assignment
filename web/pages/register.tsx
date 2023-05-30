import clsx from "clsx";
import useToken from "~/hooks/useToken.hook";
import Head from "next/head";
import type { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { RegisterSchema, type RegisterInput, Roles } from "~/lib/schema";
import { externalApi } from "~/lib/api";
import { login } from "~/services/auth";

const RegisterPage: FC = () => {
  const router = useRouter();
  const [token, setToken] = useToken();

  const registerMutation = useMutation({
    mutationFn: async (formData: RegisterInput) => {
      const registerResponse = await externalApi.post<boolean>(
        "/Account/Register",
        {
          id: 0,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          profileImage:
            "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
          phoneNumber: "0123456789",
          roles: [formData.role],
        }
      );

      if (registerResponse.data) {
        return await login(formData.email, formData.password);
      } else {
        throw new Error("Error registering user");
      }
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
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });
  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Email</span>
          </label>

          <input
            {...register("email")}
            type="email"
            className={clsx(
              "input-bordered input w-full max-w-xs",
              errors.email ? "input-error" : null
            )}
            disabled={registerMutation.isLoading}
          />

          {!!errors?.email && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.email?.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>

          <input
            {...register("firstName")}
            type="text"
            className={clsx(
              "input-bordered input w-full max-w-xs",
              errors.firstName ? "input-error" : null
            )}
            disabled={registerMutation.isLoading}
          />

          {!!errors?.firstName && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.firstName?.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>

          <input
            {...register("lastName")}
            type="text"
            className={clsx(
              "input-bordered input w-full max-w-xs",
              errors.lastName ? "input-error" : null
            )}
            disabled={registerMutation.isLoading}
          />

          {!!errors?.lastName && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.lastName?.message}
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
            disabled={registerMutation.isLoading}
          />

          {!!errors?.password && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.password?.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Role</span>
          </label>

          <select
            {...register("role")}
            className={clsx(
              "input-bordered input w-full max-w-xs",
              errors.password ? "input-error" : null
            )}
            disabled={registerMutation.isLoading}
          >
            <option value={Roles.User}>{Roles.User}</option>
            <option value={Roles.Admin}>{Roles.Admin}</option>
            <option value={Roles.SuperAdmin}>{Roles.SuperAdmin}</option>
          </select>

          {!!errors?.role && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.role?.message}
              </span>
            </label>
          )}
        </div>

        <button
          type="submit"
          className={clsx("btn", registerMutation.isLoading ? "loading" : null)}
          disabled={registerMutation.isLoading}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
