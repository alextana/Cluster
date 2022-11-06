import { Project } from "@prisma/client";
// import { IoIosArrowBack } from "react-icons/io";
import { trpc } from "../../../utils/trpc";
import Loading from "../../ui/loading/Loading";
import CreateTask from "../../ui/modals/CreateTask";
import Link from "next/link";
import DisplayTasks from "../../ui/display/tasks/DisplayTasks";
import React, { useState } from "react";
import ProjectOverview from "./views/ProjectOverview";

function ProjectView({ project }: { project: Project | null }) {
  const filters = ["overview", "milestones", "tasks"];

  const [activeFilter, setActiveFilter] = useState<string>("overview");

  const tasks = trpc.task.getAllById.useQuery({
    id: project?.id as string,
  });

  return (
    <div className="project-view w-full">
      <div className="top-bar flex items-center gap-6 pb-2">
        <Link href="/">
          <div className="flex w-max cursor-pointer items-center gap-2 hover:text-white">
            <h1 className="text-2xl font-extrabold tracking-tighter text-white">
              {project?.name}
            </h1>
          </div>
        </Link>
      </div>

      <div className="filters mt-2 mb-4 w-full border-b border-white/10">
        <div className="tabs">
          {filters.map((filter: string) => (
            <div
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={` ${
                activeFilter === filter ? "tab-active !border-purple-500 " : ""
              } tab tab-bordered text-sm font-bold capitalize text-white/80`}
            >
              {filter}
            </div>
          ))}
        </div>
      </div>

      <div className="main-view flex gap-3 py-2">
        <div className="main-column w-full">
          {activeFilter === "tasks" && (
            <React.Fragment>
              {tasks.isLoading && <Loading />}
              {tasks.isError && <div>whoops! something went wrong</div>}

              {tasks.data && tasks.data?.tasks?.length > 0 ? (
                <DisplayTasks
                  projectId={project?.id}
                  tasks={tasks.data.tasks}
                />
              ) : (
                <React.Fragment>
                  {!tasks.isLoading && (
                    <div className="grid h-[85vh] w-full place-content-center">
                      <div className="new-task min-h-[200px] min-w-[30vw] rounded-2xl border border-gray-600/40 bg-gray-800/30 p-6 shadow-2xl">
                        <h2 className="mb-4 text-2xl">
                          Create an active task!
                        </h2>
                        <p className="mb-8">
                          Tasks will be displayed on this page, to keep track of
                          what is left to do
                        </p>
                        <CreateTask projectId={project?.id} />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          {activeFilter === "overview" && (
            <ProjectOverview projectId={project?.id as string} />
          )}
        </div>
        <div className="info-column w-[30vw]">info about the project</div>
      </div>
    </div>
  );
}

export default ProjectView;
