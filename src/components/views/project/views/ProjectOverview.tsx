import Link from "next/link";
import { trpc } from "../../../../utils/trpc";
import Loading from "../../../ui/loading/Loading";

type TabType = {
  name: string;
  color?: string;
  href?: string;
};

function ProjectOverview({ projectId }: { projectId: string }) {
  const overview = trpc.project.getStats.useQuery(projectId);
  const tabs = [
    { name: "tasks", href: `/tasks/${projectId}` },
    { name: "milestones", href: `/milestones/${projectId}` },
  ];

  return (
    <div className="overview-container">
      <div className="overview-tabs flex gap-3">
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

  return (
    <div>
      <h2 className="text-lg font-extrabold capitalize tracking-tighter">
        {tab.name}
      </h2>
      <h3 className="text-3xl font-extrabold tracking-tighter">
        {overview?.[tab.name]?.completed} / {overview?.[tab.name]?.total}
      </h3>
    </div>
  );
}

export default ProjectOverview;
