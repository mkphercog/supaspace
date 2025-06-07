import { NotificationType } from "src/types";

export const getSearchParam = (
  type: NotificationType,
  commentId?: number | null,
) => {
  const replacedAndLowerCaseType = type.replace(/_/g, "-").toLocaleLowerCase();
  const base = "?goTo=";

  switch (type) {
    case "POST":
      return "";
    case "COMMENT":
    case "COMMENT_REPLY":
      return `${base}${replacedAndLowerCaseType}-${commentId}`;
    case "REACTION_TO_COMMENT":
      return `${base}${replacedAndLowerCaseType}-${commentId}`;
    case "REACTION_TO_POST":
      return `${base}${replacedAndLowerCaseType}`;
  }
};
