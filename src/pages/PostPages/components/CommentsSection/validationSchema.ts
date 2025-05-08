import * as yup from "yup";

import { COMMENT_MAX_LENGTH } from "src/constants";

export const getCommentFormConfig = (id: string) => {
  const validationSchema = yup.object({
    [`commentContent-${id}`]: yup
      .string()
      .trim()
      .required("This field is required and cannot be empty.")
      .max(COMMENT_MAX_LENGTH, `Max length: ${COMMENT_MAX_LENGTH}`),
  });

  const defaultValues = {
    [`commentContent-${id}`]: "",
  };

  return {
    validationSchema,
    defaultValues,
    fullFieldName: `commentContent-${id}`,
  };
};

export type CommentFormType = ReturnType<typeof getCommentFormConfig>;
