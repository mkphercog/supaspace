import { ONE_DAY_IN_MS } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import { DbUserDataType } from "../../../types/users";

export type UserDataType = "avatar" | "nickname";

const DATA_TYPE_CONTENT: Record<
  UserDataType,
  {
    text: UserDataType;
    dbFieldName: keyof Pick<
      DbUserDataType,
      "avatar_url_updated_at" | "nickname_updated_at"
    >;
  }
> = {
  avatar: {
    text: "avatar",
    dbFieldName: "avatar_url_updated_at",
  },
  nickname: {
    text: "nickname",
    dbFieldName: "nickname_updated_at",
  },
};

export const useCanChangeField = (dataType: UserDataType) => {
  const { dbUserData } = useAuth();

  const updatedAtValue = dbUserData?.[DATA_TYPE_CONTENT[dataType].dbFieldName];

  const lastChangeInMs = updatedAtValue
    ? new Date(updatedAtValue).getTime()
    : Date.now() - ONE_DAY_IN_MS;

  const timeAfterLastChange = Date.now() - lastChangeInMs;
  const canChange = timeAfterLastChange >= ONE_DAY_IN_MS;

  return {
    canChange,
    nextChangeDate: new Date(lastChangeInMs + ONE_DAY_IN_MS).toLocaleString(),
    fieldName: DATA_TYPE_CONTENT[dataType].text,
  };
};
