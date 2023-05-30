import clsx from "clsx";
import useToken from "~/hooks/useToken.hook";
import useCurrentUser from "~/hooks/useCurrentUser.hook";
import Head from "next/head";
import type { User } from "~/lib/types";
import { type FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { externalApi } from "~/lib/api";
import { Roles } from "~/lib/schema";

const UserPage: FC = () => {
  const router = useRouter();
  const [token] = useToken();

  const userId = router.query.id;

  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const { data: currentUserData, refetch: refetchCurrentUser } =
    useCurrentUser();

  const hasPermission = currentUserData?.roles.includes("SuperAdmin");

  const { data, isError, refetch } = useQuery({
    queryKey: ["users", userId, { token }],
    queryFn: async () => {
      const response = await externalApi.post<User>(
        "/Account/GetUserById",
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (isError) {
      router.replace("/");
    }
  }, [isError, router]);

  useEffect(() => {
    if (data) {
      setIsUser(data.roles.includes(Roles.User));
      setIsAdmin(data.roles.includes(Roles.Admin));
      setIsSuperAdmin(data.roles.includes(Roles.SuperAdmin));
    }
  }, [data]);

  const updateRoleMutation = useMutation({
    mutationFn: async () => {
      const roles: (keyof typeof Roles)[] = [];
      if (isUser) {
        roles.push(Roles.User);
      }
      if (isAdmin) {
        roles.push(Roles.Admin);
      }
      if (isSuperAdmin) {
        roles.push(Roles.SuperAdmin);
      }

      const response = await externalApi.post(
        "/Account/UpdateUserRoles",
        {
          id: data?.id,
          roles,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSettled: () => {
      refetch();
      refetchCurrentUser();
    },
  });

  return (
    <div>
      <Head>
        <title>{`User: ${
          data?.firstName ? `${data?.firstName} ${data?.lastName}` : userId
        }`}</title>
      </Head>

      {data && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>User ID</td>
                <td>{data?.id}</td>
              </tr>

              <tr>
                <td>First Name</td>
                <td>{data?.firstName}</td>
              </tr>

              <tr>
                <td>Last Name</td>
                <td>{data?.lastName}</td>
              </tr>

              <tr>
                <td>Email</td>
                <td>{data?.email}</td>
              </tr>

              <tr>
                <td>Roles</td>
                <td>
                  <div className="form-control max-w-min">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUser}
                        onChange={() => setIsUser(!isUser)}
                        className="checkbox mr-4"
                        disabled={!hasPermission}
                      />
                      <span className="label-text">User</span>
                    </label>
                  </div>

                  <div className="form-control max-w-min">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                        className="checkbox mr-4"
                        disabled={!hasPermission}
                      />
                      <span className="label-text">Admin</span>
                    </label>
                  </div>

                  <div className="form-control max-w-min">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSuperAdmin}
                        onChange={() => setIsSuperAdmin(!isSuperAdmin)}
                        className="checkbox mr-4"
                        disabled={!hasPermission}
                      />
                      <span className="label-text">Super Admin</span>
                    </label>
                  </div>

                  <button
                    className={clsx(
                      "btn mt-4",
                      updateRoleMutation.isLoading ? "loading" : null
                    )}
                    disabled={
                      updateRoleMutation.isLoading ||
                      (!isUser && !isAdmin && !isSuperAdmin) ||
                      !hasPermission
                    }
                    onClick={() => updateRoleMutation.mutate()}
                  >
                    Update Roles
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPage;
