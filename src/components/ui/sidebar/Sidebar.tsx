import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineHome, AiOutlineTeam } from "react-icons/ai";
import { MdOutlineAddTask, MdOutlineFilterNone } from "react-icons/md";
import { VscMilestone } from "react-icons/vsc";
import DisplayOrganisation from "../display/organisation/DisplayOrganisation";

function Sidebar() {
  const router = useRouter();
  const iconClass = `h-4 w-4 text-white group-hover:text-purple-600`;

  const pathnameChecker = (href: string) => {
    if (!router) return false;

    if (router.pathname === href) {
      return true;
    } else {
      return false;
    }
  };

  const links = [
    {
      name: "Homepage",
      href: "/",
      icon: <AiOutlineHome className={iconClass} />,
      active: pathnameChecker("/"),
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <MdOutlineFilterNone className={iconClass} />,
      active: pathnameChecker("/projects"),
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <MdOutlineAddTask className={iconClass} />,
      active: pathnameChecker("/tasks"),
    },
    {
      name: "Teams",
      href: "/teams",
      icon: <AiOutlineTeam className={iconClass} />,
      active: pathnameChecker("/teams"),
    },
    {
      name: "Milestones",
      href: "/milestones",
      icon: <VscMilestone className={iconClass} />,
      active: pathnameChecker("/milestones"),
    },
  ];

  return (
    <aside className="sticky top-0 min-h-screen w-[280px] border-r border-zinc-400/30 bg-zinc-900 p-4">
      <Link href="/">
        <a className="w-max min-w-[150px] text-2xl font-extrabold italic tracking-tighter text-white">
          cluster
        </a>
      </Link>

      <DisplayOrganisation />

      <div className="sidebar-links mt-3">
        {links.map(
          (link: {
            name: string;
            icon: React.ReactElement;
            href: string;
            active: boolean;
          }) => (
            <Link key={link.name} href={link.href}>
              <div
                className={`link-display transition-all ${
                  link.active ? "rounded-md bg-[#6419e6] px-2 py-1 " : ""
                } ${
                  link.active ? "" : "group"
                } mb-5 flex cursor-pointer items-center gap-2 text-sm font-bold text-white`}
              >
                <div
                  className={`link-icon ${link.active ? "!text-white" : ""}`}
                >
                  {link.icon}
                </div>
                <div className="link-name">{link.name}</div>
              </div>
            </Link>
          )
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
