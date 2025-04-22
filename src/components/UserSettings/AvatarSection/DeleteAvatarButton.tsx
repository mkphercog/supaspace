import { Id, toast } from "react-toastify";
import { Button, Typography } from "../../ui";
import { useAuth } from "../../../context/AuthContext";
import { FC } from "react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

const toastCloseReasons = new Map<Id, "user-cancelled">();

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

  if (!dbUserData) return null;

  const realAvatarDelete = async () => {
    toast.promise(
      async () =>
        await deleteUserAvatar({
          userId: dbUserData.id,
        }),
      {
        pending: `🚀 Deleting current avatar...`,
        success: `Avatar deleted successfully!`,
        error: `Oops! Something went wrong. Please try again later.`,
      }
    );
  };

  const startDeletingProcess = () => {
    const toastId = toast.warn(
      () => (
        <div className="flex flex-col gap-4">
          <Typography.Text className="font-bold" color="red">
            Deleting avatar
          </Typography.Text>
          <Typography.Text size="sm">
            If you want to stop this action, click "Cancel".
          </Typography.Text>
          <Button
            onClick={() => {
              toastCloseReasons.set(toastId, "user-cancelled");
              toast.dismiss(toastId);
            }}
            variant="primary"
          >
            Cancel
          </Button>
        </div>
      ),
      {
        onClose: () => {
          const reason = toastCloseReasons.get(toastId);
          if (reason === "user-cancelled") {
            toast.info(
              <Typography.Text size="sm">
                Your avatar stays with you! 😊
              </Typography.Text>
            );
          } else {
            realAvatarDelete();
          }
          toastCloseReasons.delete(toastId);
        },
      }
    );
  };

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
