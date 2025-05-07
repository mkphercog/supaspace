import { useMemo } from "react";

import { useAuth } from "src/context";
import { Card, Typography } from "src/shared/UI";

export const AccountInfoSection = () => {
  const { userData, isUserDataFetching } = useAuth();

  const userInfoList = useMemo(() => {
    if (!userData) return [];

    return [
      {
        title: "Full name:",
        value: userData.fullNameFromAuthProvider,
        isVisible: true,
      },
      {
        title: "Nickname:",
        value: userData.nickname,
        isVisible: userData.nickname,
      },
      {
        title: "E-mail:",
        value: userData.email,
        isVisible: true,
      },
      {
        title: "Account created at:",
        value: userData.createdAt
          ? new Date(userData.createdAt).toLocaleString()
          : "Unknown",
        isVisible: true,
      },
    ];
  }, [userData]);

  if (!userData) return null;

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
