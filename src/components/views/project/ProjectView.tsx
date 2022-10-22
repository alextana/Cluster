import { Project } from "@prisma/client";
import { IoIosArrowBack } from "react-icons/io";
import { trpc } from "../../../utils/trpc";
import Loading from "../../ui/loading/Loading";
import CreateTask from "../../ui/modals/CreateTask";
import Link from "next/link";
import DisplayTasks from "../../ui/display/tasks/DisplayTasks";

function ProjectView({ project }: { project: Project | null }) {
  const filters = ["projects", "milestones", "tasks"];

  const tasks = trpc.task.getAllById.useQuery({
    id: project?.id as string,
  });

  return (
    <div className="project-view w-full ">
      <div className="top-bar flex items-center gap-6 border-b border-gray-600 py-2  px-2 text-xs  font-bold uppercase">
        <Link href="/">
          <div className="flex w-max cursor-pointer items-center gap-2 hover:text-white">
            <IoIosArrowBack />
            <h1>{project?.name}</h1>
          </div>
        </Link>
        <div className="filters flex gap-[7px]">
          {filters.map((filter: string) => (
            <div
              className="cursor-pointer rounded-md border border-gray-200/20 bg-gray-800 px-2 py-1 text-[10px] uppercase hover:bg-gray-900"
              key={Math.random()}
            >
              {filter}
            </div>
          ))}
        </div>
      </div>
      <div className="main-view px-2 py-2">
        {tasks.isLoading && <Loading />}
        {tasks.isError && <div>whoops! something went wrong</div>}
        {tasks.data && tasks.data?.tasks?.length > 0 ? (
          <DisplayTasks projectId={project?.id} tasks={tasks.data.tasks} />
        ) : (
          <div className="grid h-[85vh] w-full place-content-center">
            <div className="new-task min-h-[200px] min-w-[30vw] rounded-2xl border border-gray-600/40 bg-gray-800/30 p-6 shadow-2xl">
              <h2 className="mb-4 text-2xl">Create an active task!</h2>
              <p className="mb-8">
                Tasks will be displayed on this page, to keep track of what is
                left to do
              </p>
              <CreateTask projectId={project?.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectView;
