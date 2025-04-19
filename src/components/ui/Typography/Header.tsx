import { FC, PropsWithChildren } from "react";
import { TYPOGRAPHY_COLOR, TypographyColors } from ".";

type HeaderComponentTypes = "h1" | "h2" | "h3" | "h4";

type HeaderProps = {
  className?: string;
  as?: HeaderComponentTypes;
  color?: TypographyColors;
};

const HEADER_SIZE: Record<HeaderComponentTypes, string> = {
  h1: "text-4xl md:text-6xl leading-14 md:leading-20 mb-6 md:mb-8",
  h2: "text-3xl md:text-5xl leading-12 md:leading-16 mb-5 md:mb-7",
  h3: "text-2xl md:text-4xl leading-10 md:leading-14 mb-4 md:mb-6",
  h4: "text-xl md:text-3xl leading-9 md:leading-12 mb-3 md:mb-5",
};

export const Header: FC<PropsWithChildren<HeaderProps>> = ({
  children,
  className = "",
  as: Component = "h1",
  color = "purple",
}) => {
  return (
    <Component
      className={`
        font-bold text-center
        ${TYPOGRAPHY_COLOR[color]} ${HEADER_SIZE[Component]}
        ${className}
       `}
    >
      {children}
    </Component>
  );
};
