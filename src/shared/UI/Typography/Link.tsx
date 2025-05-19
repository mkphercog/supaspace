import cn from "classnames";
import { FC } from "react";
import { NavLink, NavLinkProps } from "react-router";

import {
  TYPOGRAPHY_COLOR,
  TYPOGRAPHY_SIZE,
  TypographyColors,
  TypographySizes,
} from ".";

type LinkProps = {
  color?: TypographyColors;
  size?: TypographySizes;
} & NavLinkProps;

export const Link: FC<LinkProps> = ({
  children,
  className,
  color = "gray",
  size = "md",
  ...restProps
}) => {
  return (
    <NavLink
      {...restProps}
      className={({ isActive }) => {
        return cn(
          "font-medium text-gray-300 hover:text-white transition duration-300",
          { "text-purple-500": isActive },
          TYPOGRAPHY_SIZE[size],
          TYPOGRAPHY_COLOR[color],
          className
        );
      }}
      state={{ from: location.pathname }}
    >
      {children}
    </NavLink>
  );
};
