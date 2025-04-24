import { toast } from "react-toastify";
import {
  BaseForm,
  Button,
  Card,
  FormTextInput,
  Typography,
  useBaseForm,
  RequiredHint,
} from "../../ui";
import {
  useDeleteNicknameMutation,
  useSetNicknameMutation,
} from "../../../api/users";
import { useAuth } from "../../../context/AuthContext";
import {
  NICKNAME_MAX_LENGTH,
  NewNicknameFormType,
  getValidationSchema,
} from "./validationSchema";
import { DeleteNicknameButton } from "./DeleteNicknameButton";
import { NextChangeAbility } from "../NextChangeAbility/NextChangeAbility";
import { useCanChangeField } from "../NextChangeAbility/useNextChangeAbility";

export const NicknameSection = () => {
  const { canChange } = useCanChangeField("nickname");
  const { dbUserData, isUserDataFetching } = useAuth();
  const { setNewUserNickname, isSetNewUserNicknameLoading } =
    useSetNicknameMutation();
  const { deleteUserNickname, isDeleteNicknameLoading } =
    useDeleteNicknameMutation();

  const validationSchema = getValidationSchema(
    dbUserData?.full_name_from_auth_provider || "",
    dbUserData?.nickname || ""
  );

  const formParams = useBaseForm({
    validationSchema,
    defaultValues: {
      userNickname: "",
    },
  });

  if (!dbUserData) return null;

  const handleSubmit = async ({ userNickname }: NewNicknameFormType) => {
    const trimmedNickname = userNickname.trim();

    toast
      .promise(
        async () =>
          await setNewUserNickname({
            userId: dbUserData.id,
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

  const newNicknameValue = formParams.watch("userNickname");

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
          placeholder={
            dbUserData?.full_name_from_auth_provider === dbUserData?.nickname
              ? "No nick name"
              : dbUserData?.nickname
          }
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
              !newNicknameValue ||
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
