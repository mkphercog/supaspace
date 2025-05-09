import cn from "classnames";
import { FC } from "react";
import { NavLink, NavLinkProps } from "react-router";

import { TYPOGRAPHY_COLOR, TypographyColors } from ".";

type LinkProps = {
  color?: TypographyColors;
} & NavLinkProps;

export const Link: FC<LinkProps> = ({
  children,
  className,
  color = "gray",
  ...restProps
}) => {
  return (
    <NavLink
      {...restProps}
      className={({ isActive }) => {
        return cn(
          "font-medium text-gray-300 hover:text-white transition duration-300",
          { "text-purple-500": isActive },
          TYPOGRAPHY_COLOR[color],
          className
        );
      }}
    >
      {children}
    </NavLink>
  );
};
