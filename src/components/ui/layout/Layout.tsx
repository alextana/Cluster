import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { userAtom } from "../../../store/Auth";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const [, setUserAtom] = useAtom(userAtom);

  if (!session)
    return (
      <Link href="/api/auth/signin">
        <div>Login pls</div>
      </Link>
    );

  setUserAtom(session?.user);

  return (
    <>
      <main className="flex w-full">
        <Sidebar />
        <div className="main-content w-full p-3">
          <Header />

          {children}
        </div>
      </main>
    </>
  );
}
