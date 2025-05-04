import * as yup from "yup";

import { COMMENT_MAX_LENGTH } from "src/constants";

export const INITIAL_FORM_STATE: CommentFormType = {
  commentContent: "",
};

export const validationSchema = yup.object({
  commentContent: yup
    .string()
    .trim()
    .required("This field is required and cannot be empty.")
    .max(COMMENT_MAX_LENGTH, `Max length: ${COMMENT_MAX_LENGTH}`),
});

export type CommentFormType = yup.InferType<typeof validationSchema>;
