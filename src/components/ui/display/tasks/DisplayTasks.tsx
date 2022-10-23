import { Task } from "@prisma/client";
import CreateTask from "../../modals/CreateTask";
import { MdDeleteOutline } from "react-icons/md";
import { trpc } from "../../../../utils/trpc";

import { Popover } from "../../popover/Popover";
import React from "react";
import Link from "next/link";

type State = { name: string; color: string };

function DisplayTasks({
  projectId,
  tasks,
}: {
  projectId: string | undefined;
  tasks: Task[];
}) {
  const utils = trpc.useContext();

  const deleteTask = trpc.task.delete.useMutation();
  const updateStatus = trpc.task.changeStatus.useMutation();

  const taskStates = [
    { name: "open", color: "bg-gray-500" },
    { name: "in progress", color: "bg-orange-500" },
    { name: "closed", color: "bg-green-500" },
    { name: "review", color: "bg-blue-500" },
  ];

  const handleDeleteTask = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    // TODO - modal to say are u sure??
    if (!id) return;

    deleteTask.mutate(id, {
      onSuccess: () => {
        utils.task.getAllById.invalidate();
      },
    });
  };

  function handleStateClick(state: State, id: string) {
    if (!id) return;

    const data = {
      id: id,
      status: state.name,
    };

    updateStatus.mutate(data, {
      onSuccess: () => {
        utils.task.getAllById.invalidate();
      },
    });
  }

  return (
    <div className="text-xs ">
      <div className="create-new mb-4">
        <CreateTask buttonStyle="icon" projectId={projectId} />
      </div>

      {taskStates.map((state: State) => (
        <React.Fragment key={state.name}>
          {tasks.find((f) => f.status === state.name) && (
            <React.Fragment>
              <div key={state.name} className="task-list mb-4">
                <h2
                  className={`w-max ${state.color} rounded-tl-md rounded-tr-md px-3 py-1 text-[10px] font-extrabold uppercase text-white`}
                >
                  {state.name}{" "}
                  <span className="font-light">
                    ({tasks.filter((f) => f.status === state.name)?.length})
                  </span>
                </h2>
                {tasks
                  .filter((f) => f.status === state.name)
                  .map((task: Task, i: number) => (
                    <Link key={task.id} href={`/projects/tasks/${task.id}`}>
                      <div
                        className={`task flex w-full cursor-pointer items-center gap-3 px-2 py-2 text-xs hover:bg-gray-500/20 ${
                          i % 2 === 0 ? "bg-zinc-800" : "bg-zinc-800/60"
                        }`}
                      >
                        <Popover
                          trigger={
                            <div
                              className={`status ${state.color} h-3 w-3 rounded-full`}
                            />
                          }
                        >
                          <div className="select-status">
                            {taskStates.map((state: State) => (
                              <div
                                key={state.name}
                                onClick={() => handleStateClick(state, task.id)}
                                className="state flex cursor-pointer items-center gap-2 py-2 px-4 text-[10px] font-bold uppercase hover:bg-zinc-800"
                              >
                                <div
                                  className={`state-color ${state.color} h-3 w-3 rounded-full`}
                                />
                                <div>{state.name}</div>
                              </div>
                            ))}
                          </div>
                        </Popover>
                        <div className="name">{task.name}</div>
                        <div className="eta">
                          {task?.estimated_time?.toString()}
                        </div>
                        <div className="delete ml-auto hover:text-blue-500">
                          <MdDeleteOutline
                            onClick={(e) => handleDeleteTask(e, task.id)}
                            className="h-5 w-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default DisplayTasks;
