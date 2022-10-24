import Sidebar from "../sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../store/Auth";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const [, setUserAtom] = useAtom(userAtom);

  useEffect(() => {
    if (!session) return;
    setUserAtom(session?.user);
  }, [setUserAtom, session]);

  if (!session)
    return (
      <Link href="/api/auth/signin">
        <div>Login pls</div>
      </Link>
    );

  return (
    <>
      <main className="flex w-full">
        <Sidebar />
        <div className="main-content w-full p-3">{children}</div>
      </main>
    </>
  );
}
