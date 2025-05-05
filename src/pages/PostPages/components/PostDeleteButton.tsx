import { FC } from "react";

import { useDeletePostMutation } from "src/api/posts";
import { InfoIcon } from "src/assets/icons";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { FullPageLoader } from "src/shared/layout";
import { Button, Typography } from "src/shared/UI";
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
      <div>
        <Button
          onClick={startDeletingProcess}
          className="self-start"
          variant="destructive"
        >
          Delete post
        </Button>
        <Typography.Text
          className="flex items-center gap-2 mt-2"
          size="sm"
          color="blue"
        >
          <InfoIcon className="h-5 w-5" />
          You can delete this post because you are its owner.
        </Typography.Text>
      </div>

      {isDeletePostLoading && <FullPageLoader message="Deleting..." />}
    </>
  );
};
