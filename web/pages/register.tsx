import clsx from "clsx";
import type { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

const RegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(5, { message: "Required" }),
  lastName: z.string().min(5, { message: "Required" }),
  password: z.string().min(5, { message: "Required" }),
});
type RegisterInput = z.infer<typeof RegisterSchema>;

const RegisterPage: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });
  const onSubmit: SubmitHandler<RegisterInput> = (data) => {
    console.log(data);
  };

  return (
    <div>
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
          />

          {!!errors?.password && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors?.password?.message}
              </span>
            </label>
          )}
        </div>

        <button type="submit" className="btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
