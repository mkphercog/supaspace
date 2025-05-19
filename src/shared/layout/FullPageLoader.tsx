import { FC } from "react";

import { Overlay, Typography, Loader } from "src/shared/UI";

type FullPageLoaderProps = {
  message?: string;
};

export const FullPageLoader: FC<FullPageLoaderProps> = ({ message }) => {
  return (
    <Overlay>
      {message && <Typography.Header as="h1">{message}</Typography.Header>}
      <Loader />
    </Overlay>
  );
};
