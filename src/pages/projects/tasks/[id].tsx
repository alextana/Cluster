import { useRouter } from "next/router";
import Loading from "../../../components/ui/loading/Loading";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import TextEditor from "../../../components/ui/text-editor/TextEditor";
import { FiEdit3 } from "react-icons/fi";
import { useState } from "react";

function TaskId() {
  const router = useRouter();
  const { id } = router.query;
  const utils = trpc.useContext();

  const [taskName, setTaskName] = useState<string>("");

  const task = trpc.task.getById.useQuery(id as string);
  const updatedTask = trpc.task.update.useMutation();

  if (task.isLoading) return <Loading />;

  if (task.isError) return <div>whoops..</div>;

  const taskData = task.data.task;

  const maybeUpdateTaskDescription = (e: React.ChangeEvent) => {
    const taskToUpdate = task?.data?.task;

    if (!taskToUpdate) return;

    if (e?.toString() !== taskToUpdate.description) {
      updatedTask.mutate(
        {
          id: taskToUpdate.id,
          name: taskToUpdate.name,
          description: e.toString(),
        },
        {
          onSuccess: () => {
            utils.task.getById.invalidate();
          },
        }
      );
    }
  };

  const handleTitleBlur = () => {
    if (!taskName || !taskData) return;

    if (taskName !== taskData.name) {
      const newTask = {
        id: taskData.id,
        name: taskName,
      };

      updatedTask.mutate(newTask, {
        onSuccess: () => {
          utils.task.getById.invalidate();
        },
      });
    }
  };

  return (
    <div className="task my-2 rounded-md border border-white/10 bg-zinc-800 p-4">
      <div className="flex items-center gap-6">
        {/* <Link href={`/projects/${taskData?.projectId}`}>
          <div className="flex w-max cursor-pointer items-center gap-2 hover:text-white">
            <IoIosArrowBack />
            <h1 className="text-lg">{task?.data?.task?.name}</h1>
          </div>
        </Link> */}
      </div>
      <div className="task-layout flex flex-wrap gap-3 lg:flex-nowrap">
        <div className="task-name-desc w-full p-3">
          <input
            type="text"
            onBlur={handleTitleBlur}
            placeholder="Set task name"
            defaultValue={taskData?.name}
            onChange={(e) => setTaskName(e.target.value)}
            className="input input-ghost input-sm mb-2 w-full max-w-full text-2xl font-extrabold tracking-tighter"
          />
          <TextEditor
            theme="bubble"
            placeholder="Insert task description"
            handleBlur={(e) => maybeUpdateTaskDescription(e)}
            initialValue={taskData?.description}
          />
        </div>
        <div className="task-info w-[500px] border-l border-white/10 p-3"></div>
      </div>
    </div>
  );
}

export default TaskId;
