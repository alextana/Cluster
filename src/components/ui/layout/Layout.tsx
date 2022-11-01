import Sidebar from "../sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../store/Auth";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import FirstLogin from "../../views/first-login/FirstLogin";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const [, setUserAtom] = useAtom(userAtom);

  const user = trpc.user.getById.useQuery(
    {
      id: session?.user?.id as string,
    },
    {
      enabled: !!session,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!user?.data) return;
    setUserAtom(user.data);
  }, [setUserAtom, user]);

  if (!session)
    return (
      <Link href="/api/auth/signin">
        <div>Login pls</div>
      </Link>
    );
  //if first login show first login screen

  if (user?.data?.first_login) {
    return <FirstLogin user={user.data} />;
  }

  return (
    <>
      <main className="flex w-full">
        {user?.data && <Sidebar />}
        <div className="main-content w-full p-3">{children}</div>
      </main>
    </>
  );
}
