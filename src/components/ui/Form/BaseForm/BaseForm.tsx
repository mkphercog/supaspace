import type { PropsWithChildren } from "react";
import {
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import type { AnyObjectSchema } from "yup";
import type * as yup from "yup";

import type { UseBaseFormReturnedParams } from "./useBaseForm";

interface SourceFormProps<T extends AnyObjectSchema> {
  id?: string;
  formParams: UseBaseFormReturnedParams<T>;
  className?: string;
  onSubmit: SubmitHandler<yup.Asserts<T>>;
  onInvalid?: SubmitErrorHandler<yup.Asserts<T>>;
}

export type BaseFormProps<T extends AnyObjectSchema> = PropsWithChildren<
  SourceFormProps<T>
>;

export const BaseForm = <T extends AnyObjectSchema>({
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
