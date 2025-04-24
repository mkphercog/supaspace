import { Button } from "../../ui";
import { useAuth } from "../../../context/AuthContext";
import { FC } from "react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useDeleteWarnToast } from "../../../hooks/useDeleteWarnToast";

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
