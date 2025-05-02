import * as yup from "yup";

export const COMMUNITY_TITLE_MAX_LENGTH = 24;
export const COMMUNITY_DESC_MAX_LENGTH = 512;

export const INITIAL_FORM_STATE: CreateCommunityForm = {
  communityName: "",
  communityDescription: "",
};

export const validationSchema = yup.object({
  communityName: yup
    .string()
    .required("This field is required and cannot be empty.")
    .max(
      COMMUNITY_TITLE_MAX_LENGTH,
      `Max length: ${COMMUNITY_TITLE_MAX_LENGTH}`,
    ),
  communityDescription: yup
    .string()
    .required(
      "This field is required and cannot be empty.",
    )
    .max(
      COMMUNITY_DESC_MAX_LENGTH,
      `Max length: ${COMMUNITY_DESC_MAX_LENGTH}`,
    ),
});

export type CreateCommunityForm = yup.InferType<typeof validationSchema>;
