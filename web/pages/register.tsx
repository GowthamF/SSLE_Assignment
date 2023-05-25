import clsx from "clsx";
import api from "~/lib/api";
import useAuthStore from "~/hooks/useAuthStore.hook";
import Head from "next/head";
import type { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { login } from "~/services/user";

const RegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(5, { message: "Required" }),
  lastName: z.string().min(5, { message: "Required" }),
  password: z.string().min(5, { message: "Required" }),
});
type RegisterInput = z.infer<typeof RegisterSchema>;

const RegisterPage: FC = () => {
  const router = useRouter();
  const { setUser } = useAuthStore((state) => state.actions);

  const registerMutation = useMutation({
    mutationFn: async (formData: RegisterInput) => {
      const registerResponse = await api.post<boolean>("/Account/Register", {
        id: 0,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        profileImage:
          "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
        phoneNumber: "01234567890",
      });

      if (registerResponse.data === true) {
        return await login(formData.email, formData.password);
      } else {
        throw new Error("Error registering user");
      }
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
