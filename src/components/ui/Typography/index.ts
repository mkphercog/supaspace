import { Header } from "./Header";
import { Link } from "./Link";
import { Text } from "./Text";

export type TypographyColors =
  | "purple"
  | "lightPurple"
  | "gray"
  | "lime"
  | "red";

export const TYPOGRAPHY_COLOR: Record<TypographyColors, string> = {
  purple: "text-purple-600",
  lightPurple: "text-purple-400",
  gray: "text-gray-300",
  lime: "text-lime-500",
  red: "text-red-500",
};

export const Typography = {
  Header,
  Link,
  Text,
};
