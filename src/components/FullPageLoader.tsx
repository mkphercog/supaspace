import { FC } from "react";
import { Loader } from "./Loader";
import { Overlay, Typography } from "./ui";

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
