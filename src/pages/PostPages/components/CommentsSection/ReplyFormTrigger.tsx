import { FC } from "react";

import { useAuth } from "src/context";
import { Button, Typography } from "src/shared/UI";

type Props = {
  isReplyFormVisible: boolean;
  toggleReplyFormVisibility: () => void;
};

export const ReplyFormTrigger: FC<Props> = ({
  isReplyFormVisible,
  toggleReplyFormVisibility,
}) => {
  const { userData } = useAuth();

  if (!userData) return null;

  return (
    <Button
      onClick={toggleReplyFormVisibility}
      variant="ghost"
      className="col-start-2 justify-self-end text-blue-500!"
    >
      <Typography.Text size="sm" className="text-inherit">
        {isReplyFormVisible ? "Cancel" : "Reply"}
      </Typography.Text>
    </Button>
  );
};
