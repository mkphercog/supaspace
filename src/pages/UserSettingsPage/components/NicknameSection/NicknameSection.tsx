import { toast } from "react-toastify";

import {
  useDeleteNicknameMutation,
  useSetNicknameMutation,
} from "src/api/user";
import { NICKNAME_MAX_LENGTH } from "src/constants";
import { useAuth } from "src/context";
import {
  BaseForm,
  Button,
  Card,
  FormTextInput,
  Typography,
  useBaseForm,
  RequiredHint,
} from "src/shared/UI";

import { DeleteNicknameButton } from "./DeleteNicknameButton";
import { NicknameFormType, getValidationSchema } from "./validationSchema";
import { NextChangeAbility } from "../NextChangeAbility/NextChangeAbility";
import { useCanChangeField } from "../NextChangeAbility/useNextChangeAbility";

export const NicknameSection = () => {
  const { canChange } = useCanChangeField("nickname");
  const { userData, isUserDataFetching } = useAuth();
  const { setNewUserNickname, isSetNewUserNicknameLoading } =
    useSetNicknameMutation();
  const { deleteUserNickname, isDeleteNicknameLoading } =
    useDeleteNicknameMutation();

  const validationSchema = getValidationSchema(
    userData?.fullNameFromAuthProvider || "",
    userData?.nickname || ""
  );

  const formParams = useBaseForm({
    validationSchema,
    defaultValues: {
      userNickname: "",
    },
  });

  if (!userData) return null;

  const handleSubmit = async ({ userNickname }: NicknameFormType) => {
    const trimmedNickname = userNickname.trim();

    toast
      .promise(
        async () =>
          await setNewUserNickname({
            userId: userData.id,
            nickname: trimmedNickname,
          }),
        {
          pending: `🚀 Updating nickname to: ${trimmedNickname}`,
          success: `Nickname updated successfully!`,
        }
      )
      .then(() => {
        formParams.reset({ userNickname: "" });
      });
  };

  const nicknameValue = formParams.watch("userNickname");

  return (
    <Card
      isLoading={
        isSetNewUserNicknameLoading ||
        isDeleteNicknameLoading ||
        isUserDataFetching
      }
    >
      <Typography.Header as="h4" color="gray">
        Set nickname
      </Typography.Header>

      <BaseForm
        className="flex flex-col gap-3"
        formParams={formParams}
        onSubmit={handleSubmit}
      >
        <FormTextInput
          labelText="New nickname"
          name="userNickname"
          placeholder={userData.nickname ? userData.nickname : " No nickname"}
          showCounter
          maxLength={NICKNAME_MAX_LENGTH}
          isRequired
        />
        <RequiredHint />

        <NextChangeAbility dataType="nickname" />

        <div className="flex gap-4 justify-end">
          <DeleteNicknameButton deleteUserNickname={deleteUserNickname} />

          <Button
            type="submit"
            disabled={
              !!formParams.formState.errors.userNickname ||
              !nicknameValue ||
              !canChange
            }
            className="self-end"
          >
            Submit
          </Button>
        </div>
      </BaseForm>
    </Card>
  );
};
