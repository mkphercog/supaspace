import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, Typography } from "../ui";

export const AccountInfoSection = () => {
  const { dbUserData, isUserDataFetching } = useAuth();

  const isNickNameSameAsFullName = useMemo(() => {
    if (!dbUserData) return true;

    return dbUserData.nickname === dbUserData.full_name_from_auth_provider;
  }, [dbUserData]);

  const userInfoList = useMemo(() => {
    if (!dbUserData) return [];

    return [
      {
        title: "Full name:",
        value: dbUserData.full_name_from_auth_provider,
        isVisible: true,
      },
      {
        title: "Nickname:",
        value: dbUserData.nickname,
        isVisible: !isNickNameSameAsFullName,
      },
      {
        title: "E-mail:",
        value: dbUserData.email,
        isVisible: true,
      },
      {
        title: "Account created at:",
        value: dbUserData.created_at
          ? new Date(dbUserData.created_at).toLocaleString()
          : "Unknown",
        isVisible: true,
      },
    ];
  }, [dbUserData, isNickNameSameAsFullName]);

  if (!dbUserData) return null;

  return (
    <Card isLoading={isUserDataFetching}>
      <Typography.Header as="h4" color="gray" className="mb-0!">
        Account info
      </Typography.Header>

      {userInfoList.map(({ title, value, isVisible }) => {
        if (!isVisible) return null;

        return (
          <div key={title} className="flex flex-col md:flex-row gap-2">
            <Typography.Text>{title}</Typography.Text>
            <Typography.Text color="lightPurple" className="font-semibold">
              {value}
            </Typography.Text>
          </div>
        );
      })}
    </Card>
  );
};
