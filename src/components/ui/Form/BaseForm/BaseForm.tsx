import { PropsWithChildren } from "react";
import {
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import * as yup from "yup";

import { UseBaseFormReturnedParams } from "./useBaseForm";

interface SourceFormProps<T extends yup.AnyObjectSchema> {
  id?: string;
  formParams: UseBaseFormReturnedParams<T>;
  className?: string;
  onSubmit: SubmitHandler<yup.Asserts<T>>;
  onInvalid?: SubmitErrorHandler<yup.Asserts<T>>;
}

export type BaseFormProps<T extends yup.AnyObjectSchema> = PropsWithChildren<
  SourceFormProps<T>
>;

export const BaseForm = <T extends yup.AnyObjectSchema>({
  id,
  formParams,
  className,
  onSubmit,
  onInvalid,
  children,
}: BaseFormProps<T>) => {
  return (
    <FormProvider {...formParams}>
      <form
        noValidate
        onSubmit={formParams.handleSubmit(onSubmit, onInvalid)}
        className={className}
        id={id}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default BaseForm;
