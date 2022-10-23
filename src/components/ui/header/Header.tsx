import Link from "next/link";
import { MdLogout } from "react-icons/md";

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
    <header className="gap-3py-0 flex w-full items-center justify-between ">
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
        <div className="w-max cursor-pointer">
          <MdLogout />
        </div>
      </Link>
    </header>
  );
}

export default Header;
