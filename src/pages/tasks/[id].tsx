import DisplayTasks from "../../components/ui/display/tasks/DisplayTasks";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

function TaskProjectId() {
  const router = useRouter();
  const { id } = router.query;
  const tasks = trpc.task.getAllById.useQuery({
    id: id as string,
  });

  return (
    <div>
      {tasks.data && tasks.data?.tasks?.length > 0 ? (
        <DisplayTasks projectId={id as string} tasks={tasks.data.tasks} />
      ) : (
        <div>No tasks to display</div>
      )}
    </div>
  );
}

export default TaskProjectId;
