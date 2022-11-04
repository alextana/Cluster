// Popover.tsx
import { Task, User, UsersOnTasks } from "@prisma/client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useAtom } from "jotai";
import { useState } from "react";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { userAtom } from "../../../store/Auth";
import { organisationAtom } from "../../../store/Organisation";
import { trpc } from "../../../utils/trpc";
import UserAssignment from "../display/tasks/UserAssignment";

type TaskUser<T> = Partial<T> & { UsersOnTasks: UsersOnTasks };

export const AssignUsers = ({ task, tasks }: { task: Task; tasks: Task[] }) => {
  const PopoverTrigger = PopoverPrimitive.Trigger;
  const PopoverContent = PopoverPrimitive.Content;

  const [open, setIsOpen] = useState<boolean>(false);

  const [org] = useAtom(organisationAtom);
  const [userStore] = useAtom(userAtom);
  const assignToTask = trpc.task.assignToTask.useMutation();
  const removeFromTask = trpc.task.removeFromTask.useMutation();
  const utils = trpc.useContext();

  const orgUsers = trpc.user.getAvailableAndAssigned.useQuery(
    {
      taskId: task?.id as string,
      orgId: org?.[0]?.id as string,
    },
    {
      enabled: !!org?.[0]?.id && !!task?.id,
    }
  );

  const handleTaskAssignment = (
    e: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    e.preventDefault();
    if (!user || !task || !userStore) return;

    assignToTask.mutate(
      {
        assigner: userStore.id,
        email: user.email,
        name: user.name,
        image: user.image,
        taskId: task.id,
        userId: user.id,
      },
      {
        onSuccess: () => {
          utils.task.getAllById.invalidate();
          utils.user.getAvailableAndAssigned.invalidate();
          setIsOpen(false);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  const removeAssigned = (e: React.MouseEvent<SVGElement>, user: User) => {
    e.preventDefault();

    if (!user || !task || !userStore) return;

    removeFromTask.mutate(
      {
        taskId: task.id,
        userId: user.id,
      },
      {
        onSuccess: () => {
          utils.user.getAvailableAndAssigned.invalidate();
          utils.task.getAllById.invalidate();
          setIsOpen(false);
        },
      }
    );
  };

  function handleOpen(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setIsOpen(true);
  }

  return (
    <PopoverPrimitive.Root open={open}>
      <PopoverTrigger onClick={(e) => handleOpen(e)}>
        <UserAssignment currentTask={task} tasks={tasks as TaskUser<Task>[]} />
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={() => setIsOpen(false)}
        className="z-[300] mt-1 overflow-hidden rounded-md border border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur-md"
      >
        <div className="select-user z-[100]">
          <div>
            {orgUsers.isLoading && <>Loading...</>}

            {orgUsers?.data?.assignedToTask &&
              orgUsers?.data?.assignedToTask?.length > 0 && (
                <div className="assignments mb-2 w-full border-b border-white/10 pb-2">
                  <h3 className="text-center text-[10px] font-bold uppercase">
                    Assigned to:
                  </h3>
                  {orgUsers?.data?.assignedToTask?.map((user: User) => (
                    <div
                      className="flex items-center gap-1 px-2 py-2 hover:bg-purple-900"
                      key={user.id}
                    >
                      <div className="image h-[20px] w-[20px]">
                        <Image
                          src={user.image || ""}
                          alt={user.name || ""}
                          width="20px"
                          height="20px"
                          className="rounded-full"
                        />
                      </div>
                      <div className="name my-0">{user.name}</div>
                      <div className="unassign ml-auto">
                        <MdClose onClick={(e) => removeAssigned(e, user)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {orgUsers?.data && !orgUsers.isLoading && (
              <>
                {orgUsers?.data.users.map((user: User) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1 px-2 py-2 hover:bg-purple-900"
                    onClick={(e) => handleTaskAssignment(e, user)}
                  >
                    <div className="image h-[20px] w-[20px]">
                      <Image
                        src={user.image || ""}
                        alt={user.name || ""}
                        width="20px"
                        height="20px"
                        className="rounded-full"
                      />
                    </div>
                    <div className="name my-0">{user.name}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </PopoverPrimitive.Root>
  );
};
