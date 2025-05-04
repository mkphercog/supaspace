import * as yup from "yup";

import {
  POST_CONTENT_MAX_LENGTH,
  POST_MAX_FILE_SIZE_IN_kB,
  POST_TITLE_MAX_LENGTH,
} from "src/constants";

export const INITIAL_FORM_STATE: PostFormType = {
  postTitle: "",
  postContent: "",
  postImage: null,
  postCommunity: -1,
};

export const validationSchema = yup.object({
  postTitle: yup
    .string()
    .trim()
    .required("This field is required and cannot be empty.")
    .max(POST_TITLE_MAX_LENGTH, `Max length: ${POST_TITLE_MAX_LENGTH}`),
  postContent: yup
    .string()
    .trim()
    .required("This field is required and cannot be empty.")
    .max(POST_CONTENT_MAX_LENGTH, `Max length: ${POST_CONTENT_MAX_LENGTH}`),
  postImage: yup
    .mixed<File>()
    .required("This field is required and cannot be empty.")
    .nullable()
    .test(
      "fileSize",
      `File too large. Max: ${POST_MAX_FILE_SIZE_IN_kB}KB`,
      (file) => {
        if (!file) return false;

        return file && Number(file.size) / 1024 <= POST_MAX_FILE_SIZE_IN_kB;
      },
    ),
  postCommunity: yup.number(),
});

export type PostFormType = yup.InferType<typeof validationSchema>;
