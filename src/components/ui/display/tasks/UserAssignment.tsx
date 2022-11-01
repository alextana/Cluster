import { Task, UsersOnTasks } from "@prisma/client";
import { HiOutlinePlus } from "react-icons/hi";
import AvatarGroup from "../avatars/AvatarGroup";

type TaskUser<T> = Partial<T> & { UsersOnTasks: UsersOnTasks };

function UserAssignment({
  currentTask,
  tasks,
}: {
  currentTask: Task;
  tasks: TaskUser<Task>[];
}) {
  const usersOnTasks = tasks.map((t) => t.UsersOnTasks).flat(Infinity);

  const assignedTo = usersOnTasks.filter((f) => f.taskId === currentTask?.id);

  if (assignedTo && assignedTo.length > 0) {
    return <AvatarGroup size="sm" users={assignedTo} />;
  }
  return (
    <div className="avatar z-10 mr-[4px] grid h-[20px] w-[20px] transform place-content-center -space-x-6 rounded-full border border-dashed border-gray-400 bg-transparent transition-all hover:rotate-[180deg]">
      <HiOutlinePlus className="h-3 w-3" />
    </div>
  );
}

export default UserAssignment;
