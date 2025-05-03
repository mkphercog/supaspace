import { FC } from "react";

import { Overlay, Typography } from "src/components/ui";

import { Loader } from "./Loader";

type FullPageLoaderProps = {
  message?: string;
};

export const FullPageLoader: FC<FullPageLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
    <Overlay>
      <Typography.Header as="h1">{message}</Typography.Header>
      <Loader />
    </Overlay>
  );
};
