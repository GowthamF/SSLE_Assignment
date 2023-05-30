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
        <nav>
          <ul className="flex flex-row items-center gap-2">
            {data ? (
              <>
                <li>
                  <Link href="/users">Users</Link>
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
        </nav>
      </header>
      <main className="container p-4">{children}</main>
    </>
  );
};

export default Layout;
