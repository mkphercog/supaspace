import { useState } from "react";
import { toast } from "react-toastify";

import { useChangeEmailSubscribeMutation } from "src/api/user";
import { useAuth } from "src/context";
import { Button, Card, Typography } from "src/shared/UI";

export const EmailSubscribeSection = () => {
  const { userData, isUserDataFetching } = useAuth();
  const [emailSubscribeState, setEmailSubscribeState] = useState<boolean>(
    userData?.emailSubscribe === undefined ? true : userData?.emailSubscribe
  );
  const { changeEmailSubscribe, isChangeEmailSubscribeLoading } =
    useChangeEmailSubscribeMutation();

  if (!userData) return null;

  const handleChangeEmailSubscribe = async () => {
    toast.promise(
      async () =>
        await changeEmailSubscribe({
          userId: userData?.id,
          emailSubscribe: emailSubscribeState,
        }),
      {
        pending: `🚀 Updating email subscribe`,
        success: `Email subscribe updated successfully!`,
      }
    );
  };

  return (
    <Card isLoading={isChangeEmailSubscribeLoading || isUserDataFetching}>
      <Typography.Header as="h4" color="gray">
        Change email subscribe
      </Typography.Header>

      <div className="flex items-center gap-2 cursor-pointer">
        <input
          id="emailSub"
          type="checkbox"
          defaultChecked={emailSubscribeState}
          onChange={(e) => setEmailSubscribeState(e.target.checked)}
          className="accent-purple-600 w-4 h-4 cursor-pointer"
        />
        <label htmlFor="emailSub" className="cursor-pointer">
          <Typography.Text>
            Send me email notifications about new posts
          </Typography.Text>
        </label>
      </div>

      <Button
        className="self-end"
        onClick={handleChangeEmailSubscribe}
        disabled={userData.emailSubscribe === emailSubscribeState}
      >
        Save
      </Button>
    </Card>
  );
};
