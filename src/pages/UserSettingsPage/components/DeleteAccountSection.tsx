import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { Button, Card, Typography } from "src/shared/UI";

export const DeleteAccountSection = () => {
  const { deleteUserWithData, isUserDataFetching } = useAuth();
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Account",
    toastTextOnCancel: "That was close! So glad you're sticking around! 😄",
    duration: 10000,
    realDeleteFn: async () => await deleteUserWithData(),
  });

  return (
    <Card isLoading={isUserDataFetching}>
      <Typography.Header as="h4" color="gray">
        Delete account with all data
      </Typography.Header>

      <Typography.Text>
        Deleting your account is a permanent action. This cannot be undone, and
        all your data will be lost forever.
      </Typography.Text>

      <Button
        className="self-end"
        variant="destructive"
        onClick={startDeletingProcess}
      >
        Delete account
      </Button>
    </Card>
  );
};
