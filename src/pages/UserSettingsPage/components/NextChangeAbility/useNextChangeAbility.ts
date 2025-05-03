import { ONE_DAY_IN_MS } from "src/constants";
import { useAuth } from "src/context";
import { UserData } from "src/types";

export type UserDataType = "avatar" | "nickname";

const DATA_TYPE_CONTENT: Record<
  UserDataType,
  {
    text: UserDataType;
    dbFieldName: keyof Pick<
      UserData,
      "avatarUrlUpdatedAt" | "nicknameUpdatedAt"
    >;
  }
> = {
  avatar: {
    text: "avatar",
    dbFieldName: "avatarUrlUpdatedAt",
  },
  nickname: {
    text: "nickname",
    dbFieldName: "nicknameUpdatedAt",
  },
};

export const useCanChangeField = (dataType: UserDataType) => {
  const { userData } = useAuth();

  const updatedAtValue = userData?.[DATA_TYPE_CONTENT[dataType].dbFieldName];

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
