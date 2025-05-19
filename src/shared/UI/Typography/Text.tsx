import cn from "classnames";
import { FC, PropsWithChildren } from "react";

import {
  TYPOGRAPHY_COLOR,
  TYPOGRAPHY_SIZE,
  TypographyColors,
  TypographySizes,
} from ".";

type TextProps = {
  className?: string;
  color?: TypographyColors;
  title?: string;
  size?: TypographySizes;
  isTruncate?: boolean;
};

export const Text: FC<PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  color = "gray",
  title,
  size = "md",
  isTruncate,
}) => {
  return (
    <p
      className={cn(
        TYPOGRAPHY_SIZE[size],
        TYPOGRAPHY_COLOR[color],
        { truncate: isTruncate },
        className
      )}
      title={title}
    >
      {children}
    </p>
  );
};
