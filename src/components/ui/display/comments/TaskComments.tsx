import { Task, Comment, User } from "@prisma/client";
import { useAtom } from "jotai";
import Image from "next/image";
import React, { useState } from "react";
import { userAtom } from "../../../../store/Auth";
import { AiOutlineDelete } from "react-icons/ai";
import { trpc } from "../../../../utils/trpc";

function TaskComments({
  commentData,
  task,
  users,
}: {
  commentData: Comment[];
  task: Task | null;
  users: User[] | null;
}) {
  const [user] = useAtom(userAtom);
  const deleteComment = trpc.comment.delete.useMutation();
  const utils = trpc.useContext();

  const [currentComment, setCurrentComment] = useState<Comment | null>(null);

  const handleDelete = () => {
    if (!currentComment) return;

    deleteComment.mutate(currentComment.id, {
      onSuccess: () => {
        utils.task.getById.invalidate();
      },
    });
  };

  return (
    <div className="comments">
      {commentData?.map((comment: Comment) => (
        <div className="comment mb-4 flex items-center gap-1" key={comment.id}>
          <div className="user-image">
            {task && users?.length && (
              <React.Fragment>
                <Image
                  src={
                    users?.find((f: User) => f.id === comment.userId)?.image ||
                    ""
                  }
                  width="25"
                  height="25"
                  className="rounded-full"
                  alt="Author image"
                />
              </React.Fragment>
            )}
          </div>
          <div className="info">
            <div className="user-info flex gap-2">
              <h4 className="text-xs font-bold">
                {users?.find((f: User) => f.id === comment.userId)?.name}
              </h4>
              <p className="text-[9px]">
                {comment.created_at?.toLocaleDateString() || ""}
              </p>
              {comment.userId === user?.id && (
                <label
                  htmlFor="delete-modal"
                  className="modal-button delete cursor-pointer"
                  onClick={() => setCurrentComment(comment)}
                >
                  <AiOutlineDelete className="hover:text-purple-500" />
                </label>
              )}
            </div>
            <div
              className="comment text-sm"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          </div>
        </div>
      ))}

      <input type="checkbox" id="delete-modal" className="modal-toggle" />
      <label htmlFor="delete-modal" className="modal cursor-pointer">
        <label className="modal-box relative text-center" htmlFor="">
          <p>Are you sure you want to delete this comment?</p>
          <p>This action cannot be undone</p>
          <div className="mt-4 flex w-full">
            <label
              htmlFor="delete-modal"
              onClick={handleDelete}
              className="btn btn-primary btn-sm mx-auto"
            >
              Delete
            </label>
          </div>
        </label>
      </label>
    </div>
  );
}

export default TaskComments;
