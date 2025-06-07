import { NotificationType } from "src/types";

export const getSearchParam = (type: NotificationType, id?: number | null) => {
  const replacedAndLowerCaseType = type.replace(/_/g, "-").toLocaleLowerCase();
  const base = "?goTo=";

  switch (type) {
    case "POST":
      return "";
    case "COMMENT":
    case "COMMENT_REPLY":
      return `${base}${replacedAndLowerCaseType}-${id}`;
    case "REACTION":
    case "REACTION_TO_COMMENT":
      return `${base}${replacedAndLowerCaseType}`;
  }
};
