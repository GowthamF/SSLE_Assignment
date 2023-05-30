import Link from "next/link";
import useCurrentUser from "~/hooks/useCurrentUser.hook";
import useToken from "~/hooks/useToken.hook";
import type { FC, ReactNode } from "react";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const [_token, _setToken, removeToken] = useToken();

  const logout = () => {
    removeToken();
    router.replace("/");
  };

  return (
    <>
      <header className="container p-4">
        <nav className="flex flex-row items-center justify-between gap-4">
          <ul className="flex flex-row items-center gap-2">
            {data ? (
              <>
                <li>
                  <Link href="/users">Users</Link>
                </li>
                <li>
                  <Link href="/posts">Posts</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ul>

          <span className="flex-1" />

          {data?.roles?.includes("User") && (
            <Link href="/posts/create">Create Post</Link>
          )}

          {!!data && <button onClick={logout}>Logout</button>}
        </nav>

        <hr className="my-2" />
      </header>

      <main className="container p-4">{children}</main>
    </>
  );
};

export default Layout;
