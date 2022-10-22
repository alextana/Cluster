import { Task } from "@prisma/client";
import CreateTask from "../../modals/CreateTask";
import { MdDeleteOutline } from "react-icons/md";
import { trpc } from "../../../../utils/trpc";

function DisplayTasks({
  projectId,
  tasks,
}: {
  projectId: string | undefined;
  tasks: Task[];
}) {
  const utils = trpc.useContext();

  const deleteTask = trpc.task.delete.useMutation();

  const handleDeleteTask = (id: string) => {
    // TODO - modal to say are u sure??
    if (!id) return;

    deleteTask.mutate(
      { id },
      {
        onSuccess: () => {
          utils.task.getAllById.invalidate();
        },
      }
    );
  };

  return (
    <div className="text-xs ">
      <div className="create-new py-2">
        <CreateTask buttonStyle="icon" projectId={projectId} />
      </div>
      {tasks.map((task: Task, i: number) => (
        <div
          className={`task flex w-full items-center gap-3 px-2 py-1 text-xs ${
            i % 2 === 0 ? "bg-zinc-800" : "bg-zinc-700"
          }`}
          key={task.id}
        >
          <div className="status">{task.status}</div>
          <div className="name">{task.name}</div>
          <div className="eta">{task?.estimated_time?.toString()}</div>
          <div className="delete ml-auto hover:text-blue-500">
            <MdDeleteOutline
              onClick={() => handleDeleteTask(task.id)}
              className="h-5 w-5 "
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default DisplayTasks;
