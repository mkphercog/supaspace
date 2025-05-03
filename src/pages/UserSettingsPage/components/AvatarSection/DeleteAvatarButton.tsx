import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { FC } from "react";

import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { Button } from "src/shared/UI";

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
  const { userData } = useAuth();

  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Avatar",
    realDeleteFn: async () => {
      if (!userData) return;

      await deleteUserAvatar({
        userId: userData.id,
      });
    },
  });

  if (!userData) return null;

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={startDeletingProcess}
      disabled={!userData.avatarUrl}
    >
      Delete avatar
    </Button>
  );
};
