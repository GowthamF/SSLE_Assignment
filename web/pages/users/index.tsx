import api from "~/lib/api";
import useAuthStore from "~/hooks/useAuthStore.hook";
import Head from "next/head";
import type { FC } from "react";
import type { User } from "~/prisma";
import { useQuery } from "@tanstack/react-query";

const sanitizeRole = (role: User["role"]) => {
  if (role === "SuperAdmin") {
    return "Super Admin";
  }

  return role;
};

const UsersPage: FC = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const { data } = useQuery({
    queryKey: ["users", isAuth],
    queryFn: async () => {
      const response = await api.get<Omit<User, "password">[]>("/user");

      return response.data;
    },
    enabled: isAuth,
    placeholderData: [],
  });

  return (
    <div>
      <Head>
        <title>Users List</title>
      </Head>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{sanitizeRole(item.role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
