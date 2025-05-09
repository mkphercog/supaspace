import cn from "classnames";
import { FC, PropsWithChildren } from "react";

import { TYPOGRAPHY_COLOR, TypographyColors } from ".";

type TextSizes = "xxs" | "xs" | "sm" | "md" | "lg";

type TextProps = {
  className?: string;
  color?: TypographyColors;
  title?: string;
  size?: TextSizes;
  isTruncate?: boolean;
};

const TEXT_SIZE: Record<TextSizes, string> = {
  xxs: "text-[0.5rem] md:text-[0.6rem]",
  xs: "text-[0.6rem] md:text-xs",
  sm: "text-xs md:text-sm",
  md: "text-sm md:text-base",
  lg: "text-base md:text-lg",
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
        TEXT_SIZE[size],
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
