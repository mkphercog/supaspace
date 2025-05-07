import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { FC } from "react";

import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { Button } from "src/shared/UI";

type DeleteNicknameButtonProps = {
  deleteUserNickname: UseMutateAsyncFunction<
    void,
    Error,
    {
      userId: string;
    },
    unknown
  >;
};

export const DeleteNicknameButton: FC<DeleteNicknameButtonProps> = ({
  deleteUserNickname,
}) => {
  const { userData } = useAuth();
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Nickname",
    realDeleteFn: async () => {
      if (!userData) return;

      await deleteUserNickname({
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
      disabled={!userData.nickname}
    >
      Delete nickname
    </Button>
  );
};
