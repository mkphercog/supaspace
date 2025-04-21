import { toast } from "react-toastify";
import {
  BaseForm,
  Button,
  Card,
  FormTextInput,
  Typography,
  useBaseForm,
} from "../../ui";
import {
  useDeleteNicknameMutation,
  useSetNicknameMutation,
} from "../../../api/users";
import { RequiredHint } from "../../ui/Form/RequiredHint/RequiredHint";
import { useAuth } from "../../../context/AuthContext";
import {
  NICKNAME_MAX_LENGTH,
  NewNicknameFormType,
  getValidationSchema,
} from "./validationSchema";
import { DeleteNicknameButton } from "./DeleteNicknameButton";
import { InfoIcon } from "../../../assets/icons";

export const NicknameSection = () => {
  const { dbUserData } = useAuth();
  const { setNewUserNickname, isSetNewUserNicknameLoading } =
    useSetNicknameMutation();
  const { isDeleteNicknameLoading } = useDeleteNicknameMutation();

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

  const newNickname = formParams.watch("userNickname");

  return (
    <Card isLoading={isSetNewUserNicknameLoading || isDeleteNicknameLoading}>
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

        <Typography.Text
          className="flex items-center gap-2 mt-5"
          size="sm"
          color="blue"
        >
          <InfoIcon className="h-5 w-5" />
          You can change your nickname only once every 24 hours.
        </Typography.Text>

        <div className="flex gap-4 justify-end">
          <DeleteNicknameButton />

          <Button
            type="submit"
            disabled={
              !!formParams.formState.errors.userNickname || !newNickname
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
