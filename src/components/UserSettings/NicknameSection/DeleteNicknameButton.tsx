import { Id, toast } from "react-toastify";
import { Button, Typography } from "../../ui";
import { useDeleteNicknameMutation } from "../../../api/users";
import { useAuth } from "../../../context/AuthContext";

const toastCloseReasons = new Map<Id, "user-cancelled">();

export const DeleteNicknameButton = () => {
  const { dbUserData } = useAuth();
  const { deleteUserNickname } = useDeleteNicknameMutation();

  if (!dbUserData) return null;

  const deleteNickname = async () => {
    toast.promise(
      async () =>
        await deleteUserNickname({
          userId: dbUserData.id,
          nickname: dbUserData.full_name_from_auth_provider,
        }),
      {
        pending: `🚀 Deleting nickname: ${dbUserData.nickname}`,
        success: `Nickname deleted successfully!`,
        error: `Oops! Something went wrong. Please try again later.`,
      }
    );
  };

  const isNicknameSameAsFullName =
    dbUserData?.nickname === dbUserData?.full_name_from_auth_provider;

  return (
    <Button
      type="button"
      variant="ghost"
      className="text-red-500"
      onClick={() => {
        const toastId = toast.warn(
          () => (
            <div className="flex flex-col gap-4">
              <Typography.Text size="sm">
                Processing… If you want to stop this action, click "Cancel
                deleting" below.
              </Typography.Text>
              <Button
                onClick={() => {
                  toastCloseReasons.set(toastId, "user-cancelled");
                  toast.dismiss(toastId);
                }}
                variant="primary"
              >
                Cancel deleting
              </Button>
            </div>
          ),
          {
            onClose: () => {
              const reason = toastCloseReasons.get(toastId);
              if (reason === "user-cancelled") {
                toast.info(
                  <Typography.Text size="sm">
                    Your nickname stays with you! 😊
                  </Typography.Text>
                );
              } else {
                deleteNickname();
              }
              toastCloseReasons.delete(toastId);
            },
          }
        );
      }}
      disabled={isNicknameSameAsFullName}
    >
      Delete nickname
    </Button>
  );
};
