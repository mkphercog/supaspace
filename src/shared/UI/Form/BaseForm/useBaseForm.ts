import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

export type UseBaseFormParams<T extends yup.AnyObjectSchema> =
  & UseFormProps<
    yup.InferType<T>
  >
  & {
    validationSchema?: T;
  };

export type UseBaseFormReturnedParams<T extends yup.AnyObjectSchema> =
  UseFormReturn<yup.Asserts<T>, object>;

export const useBaseForm = <T extends yup.AnyObjectSchema>({
  mode = "onChange",
  defaultValues,
  validationSchema,
}: UseBaseFormParams<T>): UseBaseFormReturnedParams<T> => {
  const formParams = useForm<yup.InferType<T>>({
    mode,
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  return formParams;
};
