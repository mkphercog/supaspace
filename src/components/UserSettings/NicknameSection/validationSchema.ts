import * as yup from "yup";

export const NICKNAME_MAX_LENGTH = 24;

export const getValidationSchema = (fullName: string, nickname: string) =>
  yup.object({
    userNickname: yup
      .string()
      .trim()
      .required("This field is required and cannot be empty.")
      .max(NICKNAME_MAX_LENGTH, `Max length: ${NICKNAME_MAX_LENGTH}`)
      .test(
        "is-not-full-name",
        "Nickname cannot be the same as your full name.",
        (value) => value !== fullName,
      )
      .test(
        "is-not-current-nickname",
        "Nickname cannot be the same as your current one.",
        (value) => value !== nickname,
      ),
  });

export type NewNicknameFormType = yup.InferType<
  ReturnType<typeof getValidationSchema>
>;
