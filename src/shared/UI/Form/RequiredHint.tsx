import { FC } from "react";

import { Typography } from "src/shared/UI";

interface RequiredHintProps {
  message?: string;
}

const defaultMessage = "Required fields";

export const RequiredHint: FC<RequiredHintProps> = ({
  message = defaultMessage,
}) => {
  return <Typography.Text size="xs">* {message}</Typography.Text>;
};
