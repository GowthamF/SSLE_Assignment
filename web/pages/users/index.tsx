import useToken from "~/hooks/useToken.hook";
import Head from "next/head";
import Link from "next/link";
import type { FC } from "react";
import type { User } from "~/lib/types";
import { useQuery } from "@tanstack/react-query";
import { externalApi } from "~/lib/api";

const UsersPage: FC = () => {
  const [token] = useToken();

  const { data } = useQuery({
    queryKey: ["users", { token }],
    queryFn: async () => {
      const response = await externalApi.get<Omit<User, "roles">[]>(
        "/Account/GetUsers",
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
            </tr>
          </thead>

          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={`/users/${item.id}`} className="underline underline-offset-4">{item.id}</Link>
                </td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
