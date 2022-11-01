import Link from "next/link";
import { AiOutlineHome, AiOutlineTeam } from "react-icons/ai";
import { MdOutlineAddTask, MdOutlineFilterNone } from "react-icons/md";
import { VscMilestone } from "react-icons/vsc";
import DisplayOrganisation from "../display/organisation/DisplayOrganisation";

function Sidebar() {
  const iconClass = `h-4 w-4 text-zinc-400 group-hover:!text-purple-600`;
  const links = [
    {
      name: "Homepage",
      href: "/",
      icon: <AiOutlineHome className={iconClass} />,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <MdOutlineFilterNone className={iconClass} />,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <MdOutlineAddTask className={iconClass} />,
    },
    {
      name: "Teams",
      href: "/teams",
      icon: <AiOutlineTeam className={iconClass} />,
    },
    {
      name: "Milestones",
      href: "/milestones",
      icon: <VscMilestone className={iconClass} />,
    },
  ];
  return (
    <aside className="h-screen w-[280px] border-r border-zinc-400/30 bg-zinc-900 p-4">
      <Link href="/">
        <a className="w-max min-w-[150px] text-2xl font-extrabold italic tracking-tighter text-white">
          cluster
        </a>
      </Link>

      <DisplayOrganisation />

      <div className="sidebar-links mt-3">
        {links.map(
          (link: { name: string; icon: React.ReactElement; href: string }) => (
            <Link key={link.name} href={link.href}>
              <div className="link-display group mb-5 flex cursor-pointer items-center gap-2 text-sm font-bold text-white hover:text-white">
                <div className="link-icon">{link.icon}</div>
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
