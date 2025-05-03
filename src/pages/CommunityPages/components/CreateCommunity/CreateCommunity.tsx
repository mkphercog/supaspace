import { toast } from "react-toastify";

import { useCreateCommunity } from "src/api/community";
import {
  COMMUNITY_DESC_MAX_LENGTH,
  COMMUNITY_TITLE_MAX_LENGTH,
} from "src/constants";
import { useAuth } from "src/context";
import {
  BaseForm,
  Button,
  Card,
  FormTextarea,
  FormTextInput,
  RequiredHint,
  useBaseForm,
} from "src/shared/UI";

import {
  INITIAL_FORM_STATE,
  CreateCommunityForm,
  validationSchema,
} from "./validationSchema";

export const CreateCommunity = () => {
  const { dbUserData } = useAuth();

  const { createCommunity, isCreateCommunityLoading } = useCreateCommunity();
  const formParams = useBaseForm({
    validationSchema,
    defaultValues: INITIAL_FORM_STATE,
  });

  const handleSubmit = async ({
    communityName,
    communityDescription,
  }: CreateCommunityForm) => {
    if (!dbUserData) return;

    toast
      .promise(
        async () =>
          await createCommunity({
            name: communityName,
            description: communityDescription,
            user_id: dbUserData.id,
          }),
        {
          pending: `🚀 Creating community #${communityName}`,
          success: `Community created successfully!`,
        }
      )
      .then(() => {
        formParams.reset(INITIAL_FORM_STATE);
      });
  };

  const communityNameValue = formParams.watch("communityName");
  const communityDescValue = formParams.watch("communityDescription");

  return (
    <Card className="max-w-2xl mx-auto" isLoading={isCreateCommunityLoading}>
      <BaseForm
        className="flex flex-col gap-3"
        formParams={formParams}
        onSubmit={handleSubmit}
      >
        <FormTextInput
          labelText="Community name"
          name="communityName"
          showCounter
          maxLength={COMMUNITY_TITLE_MAX_LENGTH}
          isRequired
        />

        <FormTextarea
          labelText="Description"
          name="communityDescription"
          showCounter
          maxLength={COMMUNITY_DESC_MAX_LENGTH}
          isRequired
        />

        <RequiredHint />

        <Button
          type="submit"
          className="self-end"
          disabled={
            !!Object.keys(formParams.formState.errors).length ||
            !communityNameValue ||
            !communityDescValue
          }
        >
          Submit
        </Button>
      </BaseForm>
    </Card>
  );
};
