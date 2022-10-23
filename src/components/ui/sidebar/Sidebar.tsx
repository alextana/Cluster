import Link from "next/link";

function Sidebar() {
  return (
    <aside className="h-screen w-[210px] border-r border-zinc-400/30 p-2">
      <Link href="/">
        <a className="w-max min-w-[150px]">cluster</a>
      </Link>
    </aside>
  );
}

export default Sidebar;
