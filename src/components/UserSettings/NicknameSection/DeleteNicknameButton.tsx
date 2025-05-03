import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { FC } from "react";

import { Button } from "src/components/ui";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";

type DeleteNicknameButtonProps = {
  deleteUserNickname: UseMutateAsyncFunction<
    void,
    Error,
    {
      userId: string;
      nickname: string;
    },
    unknown
  >;
};

export const DeleteNicknameButton: FC<DeleteNicknameButtonProps> = ({
  deleteUserNickname,
}) => {
  const { dbUserData } = useAuth();
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Nickname",
    realDeleteFn: async () => {
      if (!dbUserData) return;

      await deleteUserNickname({
        userId: dbUserData.id,
        nickname: dbUserData.full_name_from_auth_provider,
      });
    },
  });

  if (!dbUserData) return null;

  const isNicknameSameAsFullName =
    dbUserData.nickname === dbUserData.full_name_from_auth_provider;

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={startDeletingProcess}
      disabled={isNicknameSameAsFullName}
    >
      Delete nickname
    </Button>
  );
};
