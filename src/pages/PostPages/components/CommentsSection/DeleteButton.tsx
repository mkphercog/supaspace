import { FC } from "react";

import { useDeleteCommentsMutation } from "src/api/comments";
import { TrashIcon } from "src/assets/icons";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { Button } from "src/shared/UI";
import { Comment, Post, UserData } from "src/types";

type Props = {
  postId: Post["id"];
  commentId: Comment["id"];
  ownerId: UserData["id"];
};

export const DeleteButton: FC<Props> = ({ postId, commentId, ownerId }) => {
  const { userData } = useAuth();
  const { deleteComment } = useDeleteCommentsMutation(postId);
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Comment",
    realDeleteFn: async () => {
      if (!userData) return;

      await deleteComment({
        id: commentId,
      });
    },
  });

  if (!userData || userData.id !== ownerId) return null;

  return (
    <Button
      ariaLabel="Delete comment"
      className="col-start-3 row-start-1 p-0! bg-transparent! hover:scale-125"
      variant="ghost"
      onClick={startDeletingProcess}
    >
      <TrashIcon className="text-red-500 w-5 h-5" />
    </Button>
  );
};
