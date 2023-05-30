import Link from "next/link";
import useCurrentUser from "~/hooks/useCurrentUser.hook";
import type { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { data } = useCurrentUser();

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

          {data?.roles?.includes("User") && (
            <Link href="/posts/create">Create Post</Link>
          )}
        </nav>

        <hr className="my-2" />
      </header>

      <main className="container p-4">{children}</main>
    </>
  );
};

export default Layout;
