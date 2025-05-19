import { Header } from "./Header";
import { Link } from "./Link";
import { Text } from "./Text";

export type TypographySizes = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export const TYPOGRAPHY_SIZE: Record<TypographySizes, string> = {
  xxs: "text-[0.5rem] md:text-[0.6rem]",
  xs: "text-[0.6rem] md:text-xs",
  sm: "text-xs md:text-sm",
  md: "text-sm md:text-base",
  lg: "text-base md:text-lg",
  xl: "text-lg md:text-xl",
  "2xl": "text-xl md:text-2xl",
};

export type TypographyColors =
  | "purple"
  | "lightPurple"
  | "gray"
  | "lime"
  | "red"
  | "blue"
  | "amber";

export const TYPOGRAPHY_COLOR: Record<TypographyColors, string> = {
  purple: "text-purple-600",
  lightPurple: "text-purple-400",
  gray: "text-gray-300",
  lime: "text-lime-400",
  red: "text-red-500",
  blue: "text-sky-500",
  amber: "text-amber-500",
};

export const Typography = {
  Header,
  Link,
  Text,
};
