import { useRouter } from "next/router";
import Loading from "../../../components/ui/loading/Loading";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import TextEditor from "../../../components/ui/text-editor/TextEditor";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useState } from "react";
import { userAtom } from "../../../store/Auth";
import { useAtom } from "jotai";
import TaskComments from "../../../components/ui/display/comments/TaskComments";
import AvatarGroup from "../../../components/ui/display/avatars/AvatarGroup";

function TaskId() {
  const router = useRouter();
  const { id } = router.query;
  const utils = trpc.useContext();

  const [user] = useAtom(userAtom);

  const [comment, setComment] = useState<string>("");
  const [taskName, setTaskName] = useState<string>("");

  const [commentUpdated, setCommentUpdated] = useState<number>(0);

  const task = trpc.task.getById.useQuery(id as string);
  const assignedUsers = trpc.user.getAssignedByTask.useQuery({
    taskId: id as string,
  });
  const updatedTask = trpc.task.update.useMutation();
  const createComment = trpc.comment.create.useMutation();

  if (task.isLoading) return <Loading />;

  if (task.isError) return <div>whoops..</div>;

  const taskData = task.data.task;
  const commentData = task.data.comments;

  const maybeUpdateTaskDescription = (e: string) => {
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

  const handleSaveComment = () => {
    if (!comment || !user || !taskData) return;

    const newComment = {
      userId: user.id,
      content: comment,
      taskId: taskData.id,
      created_at: new Date(),
    };

    createComment.mutate(newComment, {
      onSuccess: () => {
        utils.task.getById.invalidate();
        setCommentUpdated(commentUpdated + 1);
      },
    });
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
    <div className="task-view">
      <div className="top-task-view-navigation flex items-center gap-3">
        <Link href={`/projects/${taskData?.projectId}`}>
          <MdClose className="h-6 w-6 cursor-pointer" />
        </Link>
        <div className="task-nav flex items-center gap-1">
          <div className="next-button grid h-8 w-8 cursor-pointer place-content-center rounded-md border border-zinc-400 bg-zinc-700 hover:bg-zinc-800">
            <BiChevronUp className="h-6 w-6" />
          </div>
          <div className="prev-button grid h-8 w-8 cursor-pointer place-content-center rounded-md border border-zinc-400 bg-zinc-700 hover:bg-zinc-800">
            <BiChevronDown className="h-6 w-6" />
          </div>
        </div>
      </div>
      <div className="task my-2 rounded-md border border-white/10 bg-zinc-800 p-4 shadow-2xl">
        <div className="task-layout flex flex-wrap gap-3 lg:flex-nowrap">
          <div className="task-name-desc w-full p-3">
            <div className="task-title mb-4 flex items-center gap-1">
              {assignedUsers.data && <AvatarGroup users={assignedUsers.data} />}
              <input
                type="text"
                onBlur={handleTitleBlur}
                placeholder="Set task name"
                defaultValue={taskData?.name}
                onChange={(e) => setTaskName(e.target.value)}
                className="input input-ghost input-sm w-full max-w-full text-2xl font-extrabold tracking-tighter"
              />
            </div>

            <TextEditor
              theme="bubble"
              placeholder="Insert task description"
              handleBlur={(e) => maybeUpdateTaskDescription(e)}
              initialValue={taskData?.description}
            />

            <div className="activity-comments mx-auto max-w-[800px]">
              <div className="activity mt-8 p-3">
                <h3 className="text-xl font-extrabold tracking-tighter">
                  Activity
                </h3>
              </div>

              <div className="comments p-3">
                <h3 className="mb-3 text-xl font-extrabold tracking-tighter">
                  Comments
                </h3>
                {commentData && (
                  <TaskComments
                    commentData={commentData}
                    task={taskData}
                    users={task?.data?.users}
                  />
                )}
                <TextEditor
                  key={commentUpdated}
                  handleChange={(e) => setComment(e)}
                  theme="bubble"
                  className="test mt-4 !text-lg"
                  placeholder="Write a comment"
                />
                <div className="save-comment mt-2 flex w-full gap-2">
                  <button
                    onClick={handleSaveComment}
                    className="btn btn-primary btn-sm ml-auto"
                  >
                    comment
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="task-info w-[500px] border-l border-white/10 p-3"></div>
        </div>
      </div>
    </div>
  );
}

export default TaskId;
