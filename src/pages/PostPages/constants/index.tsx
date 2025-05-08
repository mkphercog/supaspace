import { ReactNode } from "react";

import {
  BicepsIcon,
  DislikeIcon,
  HeartIcon,
  LaughingIcon,
  LikeIcon,
  ShockIcon,
} from "src/assets/icons";
import { Reaction } from "src/types";

export const REPLY_STYLE_COLORS: Record<number, string> = {
  0: "bg-gray-600/5 border-gray-300/20",
  1: "bg-purple-600/5 border-purple-400/20",
  2: "bg-pink-600/5 border-pink-400/20",
  3: "bg-yellow-600/5 border-yellow-400/20",
  4: "bg-blue-600/5 border-blue-400/20",
  5: "bg-emerald-600/5 border-emerald-400/20",
  6: "bg-indigo-600/5 border-indigo-400/20",
};

export const REPLY_STYLE_COLORS_LENGTH = Object.keys(REPLY_STYLE_COLORS).length;

export const REACTION_ICONS_MAP: Record<Reaction, ReactNode> = {
  LIKE: <LikeIcon className="text-gray-200 w-4 h-4 md:w-5 md:h-5" />,
  DISLIKE: <DislikeIcon className="text-gray-200 w-4 h-4 md:w-5 md:h-5" />,
  HEART: <HeartIcon className="text-red-500 w-4 h-4 md:w-5 md:h-5" />,
  STRONG: <BicepsIcon className="text-orange-200 w-4 h-4 md:w-5 md:h-5" />,
  FUNNY: <LaughingIcon className="text-yellow-500 w-4 h-4 md:w-5 md:h-5" />,
  WOW: <ShockIcon className="text-yellow-500 w-4 h-4 md:w-5 md:h-5" />,
};
