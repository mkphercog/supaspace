import { FC } from "react";

import { InfoIcon } from "src/assets/icons";
import { Typography } from "src/shared/UI";

import { UserDataType, useCanChangeField } from "./useNextChangeAbility";

type NextChangeAbilityProps = {
  dataType: UserDataType;
};

export const NextChangeAbility: FC<NextChangeAbilityProps> = ({ dataType }) => {
  const { canChange, nextChangeDate, fieldName } = useCanChangeField(dataType);

  return (
    <div className="flex flex-col gap-2">
      <Typography.Text
        className="flex items-center gap-2 mt-5"
        size="sm"
        color="blue"
      >
        <InfoIcon className="h-5 w-5" />
        You can change your {fieldName} only once every 24 hours.
      </Typography.Text>

      <Typography.Text size="xs" color={canChange ? "lime" : "blue"}>
        {`Next change: ${canChange ? "Available" : nextChangeDate}`}
      </Typography.Text>
    </div>
  );
};
