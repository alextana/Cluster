import { Task, UsersOnTasks } from "@prisma/client";
import Link from "next/link";
import { trpc } from "../../../../utils/trpc";
import Loading from "../../../ui/loading/Loading";
import AvatarGroup from "../../../ui/display/avatars/AvatarGroup";

type TabType = {
  name: string;
  color?: string;
  href?: string;
};

type TaskUser = (Task & { UsersOnTasks: UsersOnTasks[] })[];

function ProjectOverview({
  projectId,
  tasks,
}: {
  projectId: string;
  tasks: TaskUser | undefined;
}) {
  const taskIds = tasks?.map((f) => f?.id) as string[];

  const assignedUsers = trpc.user.getAllAssigned.useQuery(taskIds, {
    enabled: !!taskIds,
  });

  const overview = trpc.project.getStats.useQuery(projectId);
  const tabs = [
    { name: "tasks", href: `/tasks/${projectId}` },
    { name: "milestones", href: `/milestones/${projectId}` },
  ];

  return (
    <div className="overview-container">
      <div className="assigned-users-to-project mb-4 flex items-center justify-between gap-5">
        {assignedUsers.data && assignedUsers.data?.length > 0 && (
          <AvatarGroup size="md" users={assignedUsers.data} />
        )}
        <button className="btn btn-outline btn-sm ml-auto text-xs">
          Invite
        </button>
      </div>

      <div className="overview-tabs items-centerss grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {tabs.map((tab: TabType) => (
          <Link key={tab.name} href={tab.href as string}>
            <a
              className={`grid w-full rounded-xl border border-zinc-600 bg-zinc-800 p-6 shadow-sm hover:bg-zinc-900`}
            >
              <Tab
                tab={tab}
                overview={overview.data}
                isLoading={overview.isLoading}
                isError={overview.isError}
              />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

type Overview =
  | {
      [key: string]: {
        total: number;
        completed: number;
      };
    }
  | undefined;

function Tab({
  overview,
  isLoading,
  isError,
  tab,
}: {
  overview: Overview;
  tab: TabType;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mx-auto w-full">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>Whoops.. an error has occurred</div>;
  }

  const percentage =
    (Number(overview?.[tab.name]?.completed) /
      Number(overview?.[tab.name]?.total)) *
    100;

  const complete =
    (Number(overview?.[tab.name]?.completed) /
      Number(overview?.[tab.name]?.total)) *
      100 ===
    100;

  return (
    <div className="flex items-center justify-between gap-6 transition-all">
      <div className="main-info">
        <h2 className="text-lg font-light capitalize">{tab.name}</h2>
        <h3 className="text-3xl font-extrabold tracking-tighter">
          {overview?.[tab.name]?.completed} / {overview?.[tab.name]?.total}
        </h3>
      </div>

      <div className="progress-bar">
        <div
          className={`radial-progress bg-zinc-900/70 ${
            complete ? "text-green-500" : ""
          }`}
          style={
            {
              "--value": percentage,
            } as React.CSSProperties
          }
        >
          {Math.round(percentage)} %
        </div>
      </div>
    </div>
  );
}

export default ProjectOverview;
