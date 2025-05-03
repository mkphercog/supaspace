import * as yup from "yup";

import {
  COMMUNITY_DESC_MAX_LENGTH,
  COMMUNITY_TITLE_MAX_LENGTH,
} from "src/constants";

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
