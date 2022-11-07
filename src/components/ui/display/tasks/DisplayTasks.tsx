import { Task } from "@prisma/client";
import CreateTask from "../../modals/CreateTask";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";

import { trpc } from "../../../../utils/trpc";

import { Popover } from "../../popover/Popover";
import { AssignUsers } from "../../popover/AssignUsers";
import React, { useEffect } from "react";
import SingleTask from "./SingleTask";
import { expandedTask } from "../../../../store/General";
import { useAtom } from "jotai";
import toast from "react-hot-toast";

type State = { name: string; textColor: string; backgroundColor: string };

function DisplayTasks({
  projectId,
  tasks,
}: {
  projectId: string | undefined;
  tasks: Task[];
}) {
  const router = useRouter();
  const utils = trpc.useContext();

  const deleteTask = trpc.task.delete.useMutation();
  const updateStatus = trpc.task.changeStatus.useMutation();

  const [taskExpanded, setExpandedTask] = useAtom(expandedTask);

  const taskStates = [
    {
      name: "open",
      textColor: "text-gray-500",
      backgroundColor: "bg-gray-500",
    },
    {
      name: "in progress",
      textColor: "text-orange-500",
      backgroundColor: "bg-orange-500",
    },
    {
      name: "closed",
      textColor: "text-green-500",
      backgroundColor: "bg-green-500",
    },
    {
      name: "review",
      textColor: "text-blue-500",
      backgroundColor: "bg-blue-500",
    },
  ];

  const handleDeleteTask = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    // TODO - modal to say are u sure??
    if (!id) return;

    toast.promise(utils.task.getAllById.invalidate(), {
      loading: "Deleting task...",
      success: <b>Task deleted!</b>,
      error: <b>Could not delete task.</b>,
    });

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

    toast.promise(utils.task.getAllById.invalidate(), {
      loading: `Changing task to ${state.name}...`,
      success: <b>Task set to {state.name}!</b>,
      error: <b>Could not change task status.</b>,
    });

    updateStatus.mutate(data, {
      onSuccess: () => {
        utils.task.getAllById.invalidate();
        utils.project.getStats.invalidate();
      },
    });
  }

  function expandTask(taskId: string) {
    router.replace({
      pathname: router.asPath,
      query: {
        openTask: taskId,
      },
    });
    setExpandedTask(taskId);
  }

  useEffect(() => {
    if (router.query.openTask) {
      setExpandedTask(router.query.openTask as string);
    }
  }, [router.query, setExpandedTask]);

  if (taskExpanded) {
    return <SingleTask taskId={taskExpanded} />;
  }

  return (
    <div className="text-xs">
      <div className="create-new mb-4">
        <CreateTask buttonStyle="icon" projectId={projectId} />
      </div>

      <div className="list">
        {taskStates.map((state: State) => (
          <div key={state.name}>
            {tasks.find((f) => f.status === state.name) && (
              <React.Fragment>
                <div key={state.name} className="task-list mb-4">
                  <div
                    className={`mb-2 flex w-max items-center gap-2 rounded-full bg-zinc-900 ${state.textColor} px-3 py-3 text-sm font-bold capitalize text-white`}
                  >
                    {state.name}{" "}
                    <div
                      className={`${state.backgroundColor} grid h-5 min-w-[1.25rem] place-content-center rounded-full p-1 text-[12px] font-extrabold text-white`}
                    >
                      {tasks.filter((f) => f.status === state.name)?.length}
                    </div>
                  </div>
                  {tasks
                    .filter((f) => f.status === state.name)
                    .map((task: Task, i: number) => (
                      <div
                        key={task.id}
                        className={`task z-[-1] mb-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-gray-500/20 ${
                          i % 2 === 0 ? "bg-zinc-800" : "bg-zinc-800/60"
                        }`}
                      >
                        <Popover
                          trigger={
                            <div
                              className={`status ${state.backgroundColor} h-3 w-3 rounded-full`}
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
                                  className={`state-color ${state.backgroundColor} h-3 w-3 rounded-full`}
                                />
                                <div>{state.name}</div>
                              </div>
                            ))}
                          </div>
                        </Popover>

                        <div
                          onClick={() => expandTask(task.id)}
                          className="name w-full"
                        >
                          {task.name}
                        </div>
                        <div className="right-side ml-auto flex items-center gap-3">
                          <div className="assigned-to h-[25px]">
                            <AssignUsers tasks={tasks} task={task} />
                          </div>
                          <div className="eta">
                            {task?.estimated_time?.toString()}
                          </div>
                          <div className="delete ml-auto hover:text-blue-500">
                            <MdClose
                              onClick={(e) => handleDeleteTask(e, task.id)}
                              className="h-5 w-5 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </React.Fragment>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayTasks;
