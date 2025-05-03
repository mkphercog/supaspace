import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { FC } from "react";

import { Button } from "src/components/ui";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";

type DeleteAvatarButtonProps = {
  deleteUserAvatar: UseMutateAsyncFunction<
    void,
    Error,
    {
      userId: string;
    },
    unknown
  >;
};

export const DeleteAvatarButton: FC<DeleteAvatarButtonProps> = ({
  deleteUserAvatar,
}) => {
  const { dbUserData } = useAuth();

  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Avatar",
    realDeleteFn: async () => {
      if (!dbUserData) return;

      await deleteUserAvatar({
        userId: dbUserData.id,
      });
    },
  });

  if (!dbUserData) return null;

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={startDeletingProcess}
      disabled={!dbUserData.avatar_url}
    >
      Delete avatar
    </Button>
  );
};
