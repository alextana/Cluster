import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import Button from "../forms/button/Button";
import TextEditor from "../text-editor/TextEditor";
import { IoCreateOutline } from "react-icons/io5";

function CreateTask({
  projectId,
  buttonStyle = "button",
}: {
  projectId: string | undefined;
  buttonStyle?: "icon" | "button";
}) {
  const [taskName, setTaskName] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const utils = trpc.useContext();

  const createTask = trpc.task.create.useMutation();

  async function handleCreateTask() {
    if (!taskName || !projectId) return;

    const task = {
      name: taskName,
      status: "open",
      description: taskDescription,
      created_at: new Date(),
      assigned_to: [],
      projectId: projectId as string,
    };

    createTask.mutate(task, {
      onSuccess: () => {
        utils.task.getAllById.invalidate();
      },
    });
  }

  return (
    <div className="create-task">
      {buttonStyle === "button" && (
        <label htmlFor="my-modal" className="modal-button btn btn-primary">
          Create task
        </label>
      )}

      {buttonStyle === "icon" && (
        <label htmlFor="my-modal">
          <div className="btn btn-sm mb-2 flex w-max gap-1 text-[10px]">
            <IoCreateOutline className="h-4 w-4" />
            add task
          </div>
        </label>
      )}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label htmlFor="my-modal" className="modal cursor-pointer">
        <label
          className="modal-box relative min-h-[300px] bg-zinc-700 pb-16"
          htmlFor=""
        >
          <input
            type="text"
            autoFocus
            placeholder="Task name"
            onChange={(e) => setTaskName(e.target.value)}
            className="input input-ghost input-sm mb-4 w-full max-w-xs"
          />

          <TextEditor handleChange={(e) => setTaskDescription(e)} />

          <div className="toggles absolute bottom-0 right-0 w-full border-t border-white/10">
            <div className="button ml-auto w-max p-3">
              <Button
                handleClick={handleCreateTask}
                extraClass="btn btn-sm btn-primary text-white"
              >
                Create task
              </Button>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
}

export default CreateTask;
