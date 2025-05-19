import { Id, toast } from "react-toastify";

import { Button, Typography } from "src/shared/UI";

const deleteToastCloseReasons = new Map<Id, "user-cancelled">();

type UseDeleteWarnToastProps = {
  subjectName: string;
  realDeleteFn: () => Promise<void>;
  toastTextOnCancel?: string;
  duration?: number;
};

export const useDeleteWarnToast = ({
  subjectName,
  realDeleteFn,
  duration = 4000,
  toastTextOnCancel,
}: UseDeleteWarnToastProps) => {
  const subjectNameLower = subjectName.toLowerCase();

  const realDelete = async () => {
    toast.promise(realDeleteFn, {
      pending: `🚀 Deleting ${subjectNameLower}...`,
      success: `${subjectName} deleted successfully!`,
      error: `Oops! Something went wrong. Please try again later.`,
    });
  };

  const startDeletingProcess = () => {
    const toastId = toast.warn(
      () => (
        <div className="flex flex-col gap-4">
          <Typography.Text className="font-bold" color="red">
            Deleting {subjectNameLower}!
          </Typography.Text>
          <Typography.Text size="sm">
            Last chance! If you want to stop this action, click "Cancel".
          </Typography.Text>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                deleteToastCloseReasons.set(toastId, "user-cancelled");
                toast.dismiss(toastId);
              }}
              variant="ghost"
            >
              <Typography.Text>Cancel</Typography.Text>
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(toastId);
              }}
              variant="destructive"
            >
              <Typography.Text>Delete</Typography.Text>
            </Button>
          </div>
        </div>
      ),
      {
        onClose: () => {
          const reason = deleteToastCloseReasons.get(toastId);
          if (reason === "user-cancelled") {
            toast.info(
              <Typography.Text size="sm">
                {toastTextOnCancel ||
                  `Your ${subjectNameLower} stays with you! 😊`}
              </Typography.Text>
            );
          } else {
            realDelete();
          }
          deleteToastCloseReasons.delete(toastId);
        },
        closeButton: false,
        autoClose: duration,
      }
    );
  };

  return {
    startDeletingProcess,
  };
};
