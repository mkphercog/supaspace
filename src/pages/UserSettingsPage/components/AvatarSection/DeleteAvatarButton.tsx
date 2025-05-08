import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { FC } from "react";

import { SB_STORAGE } from "src/constants";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { Button } from "src/shared/UI";
import { UserData } from "src/types";
import { getFilePathToDeleteFromStorage } from "src/utils";

type DeleteAvatarButtonProps = {
  deleteUserAvatar: UseMutateAsyncFunction<
    void,
    Error,
    {
      userId: UserData["id"];
      userAvatarPathToDelete: string;
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
        userAvatarPathToDelete: getFilePathToDeleteFromStorage({
          fullFileUrl: userData.avatarUrl || "",
          storagePrefix: `${SB_STORAGE.avatars}/`,
        }),
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
