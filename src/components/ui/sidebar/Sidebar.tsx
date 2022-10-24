import Link from "next/link";
import { AiOutlineHome, AiOutlineTeam } from "react-icons/ai";
import { MdOutlineAddTask, MdOutlineFilterNone } from "react-icons/md";
import { VscMilestone } from "react-icons/vsc";

function Sidebar() {
  const iconClass = `h-4 w-4 text-zinc-400 group-hover:!text-purple-600`;
  const links = [
    {
      name: "Homepage",
      icon: <AiOutlineHome className={iconClass} />,
    },
    {
      name: "Projects",
      icon: <MdOutlineFilterNone className={iconClass} />,
    },
    {
      name: "Tasks",
      icon: <MdOutlineAddTask className={iconClass} />,
    },
    {
      name: "Team",
      icon: <AiOutlineTeam className={iconClass} />,
    },
    {
      name: "Milestones",
      icon: <VscMilestone className={iconClass} />,
    },
  ];
  return (
    <aside className="h-screen w-[210px] border-r border-zinc-400/30 bg-zinc-900 p-4">
      <Link href="/">
        <a className="w-max min-w-[150px] text-2xl font-extrabold italic tracking-tighter text-white">
          cluster
        </a>
      </Link>

      <div className="sidebar-links mt-6">
        {links.map((link: { name: string; icon: React.ReactElement }) => (
          <div
            key={link.name}
            className="link-display group mb-4 flex cursor-pointer items-center gap-2 text-xs font-bold text-white hover:text-white"
          >
            <div className="link-icon">{link.icon}</div>
            <div className="link-name">{link.name}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
