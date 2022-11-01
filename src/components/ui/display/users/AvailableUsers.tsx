import { trpc } from "../../../../utils/trpc";
import { organisationAtom } from "../../../../store/Organisation";
import { useAtom } from "jotai";
import { Task, User } from "@prisma/client";
import { MdClose } from "react-icons/md";

import Image from "next/image";
import { userAtom } from "../../../../store/Auth";

function AvailableUsers({ task }: { task?: Task }) {
  // TODO cLEANUP
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
          utils.user.getAvailableAndAssigned.invalidate();
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
          console.log("succ");
          utils.task.getAllById.invalidate();
        },
      }
    );
  };

  return (
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
  );
}

export default AvailableUsers;
