import Link from "next/link";

function Header() {
  const links: Link[] = [
    { name: "Projects", href: "/projects", icon: "" },
    { name: "Ideas", href: "/ideas", icon: "" },
  ];

  interface Link {
    name: string;
    href: string;
    icon: string;
  }

  return (
    <header className="flex w-full items-center justify-between gap-3 bg-zinc-900 px-3 py-1">
      <Link href="/">
        <a className="w-max min-w-[150px]">cluster</a>
      </Link>

      <nav className="toolbar w-full">
        {links && (
          <div className="nav-items flex w-full gap-12">
            {links.map((link: Link) => (
              <Link key={link.name} href={link.href}>
                <a>{link.name}</a>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <Link href="/api/auth/signout">
        <div>log out</div>
      </Link>
    </header>
  );
}

export default Header;
