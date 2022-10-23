import { useRouter } from "next/router";
import Loading from "../../../components/ui/loading/Loading";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import TextEditor from "../../../components/ui/text-editor/TextEditor";

function TaskId() {
  const router = useRouter();
  const { id } = router.query;
  const utils = trpc.useContext();

  const task = trpc.task.getById.useQuery(id as string);
  const updatedTask = trpc.task.update.useMutation();

  if (task.isLoading) return <Loading />;

  if (task.isError) return <div>whoops..</div>;

  const maybeUpdateTaskDescription = (e: React.ChangeEvent) => {
    const taskToUpdate = task?.data?.task;

    if (!taskToUpdate) return;

    if (e?.toString() !== taskToUpdate.description) {
      updatedTask.mutate(
        {
          id: taskToUpdate.id,
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

  return (
    <div className="task">
      <div className="top-bar flex items-center gap-6 border-b border-white/10 pt-4 pb-2 text-xs font-bold uppercase">
        <Link href={`/projects/${task.data?.task?.projectId}`}>
          <div className="flex w-max cursor-pointer items-center gap-2 hover:text-white">
            <IoIosArrowBack />
            <h1 className="text-lg">{task?.data?.task?.name}</h1>
          </div>
        </Link>
      </div>
      <div className="task-layout flex flex-wrap gap-3 lg:flex-nowrap">
        <div className="task-description w-full p-3">
          <TextEditor
            theme="bubble"
            placeholder="Insert task description"
            handleBlur={(e) => maybeUpdateTaskDescription(e)}
            initialValue={task.data?.task?.description}
          />
        </div>
        <div className="task-info w-[500px] p-3">other task side</div>
      </div>
    </div>
  );
}

export default TaskId;
