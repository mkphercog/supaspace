import { FC } from "react";

import { useDeletePostMutation } from "src/api/posts";
import { TrashIcon } from "src/assets/icons";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { FullPageLoader } from "src/shared/layout";
import { Button } from "src/shared/UI";
import { PostDetails } from "src/types";

type Props = {
  postId: PostDetails["id"];
  authorId: PostDetails["author"]["id"];
  postImagePathToDelete: string;
};

export const PostDeleteButton: FC<Props> = ({
  postId,
  authorId,
  postImagePathToDelete,
}) => {
  const { userData } = useAuth();
  const { deletePost, isDeletePostLoading } = useDeletePostMutation();
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Post",
    realDeleteFn: async () => {
      if (!userData) return;

      await deletePost({ postId, postImagePathToDelete });
    },
  });

  if (userData?.id !== authorId) return null;

  return (
    <>
      <Button
        ariaLabel="Delete post"
        className="ml-auto p-0! bg-transparent! hover:scale-125"
        variant="ghost"
        onClick={startDeletingProcess}
      >
        <TrashIcon className="text-red-500 w-6 h-6" />
      </Button>

      {isDeletePostLoading && <FullPageLoader message="Deleting your post" />}
    </>
  );
};
