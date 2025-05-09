import { RefMDEditor } from "@uiw/react-md-editor";
import cn from "classnames";
import { ChangeEventHandler, FC, lazy, useRef } from "react";
import { useController } from "react-hook-form";

import { Typography } from "src/shared/UI";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

type FromMDEditorProps = {
  labelText: string;
  name: string;
  className?: string;
  maxLength?: number;
  isRequired?: boolean;
  showCounter?: boolean;
  isLoading?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  value?: string | undefined;
};

export const FormMDEditor: FC<FromMDEditorProps> = ({
  labelText,
  name,
  className,
  maxLength,
  isRequired = false,
  showCounter = true,
  onChange,
  value,
}) => {
  const { field, fieldState } = useController({ name });
  const MDEditorRef = useRef<RefMDEditor>(null);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div>
        <label
          htmlFor={name}
          className="block mb-1"
          onMouseEnter={() =>
            MDEditorRef.current?.container?.classList.add("border-purple-600")
          }
          onMouseLeave={() =>
            MDEditorRef.current?.container?.classList.remove(
              "border-purple-600"
            )
          }
        >
          <div className="flex justify-between items-end">
            <Typography.Text size="sm" className="font-semibold">
              {labelText} {isRequired && "*"}
            </Typography.Text>

            {showCounter && maxLength && (
              <Typography.Text size="xs">{`${
                field?.value?.length ?? 0
              }/${maxLength}`}</Typography.Text>
            )}
          </div>
        </label>
        <MDEditor
          className={cn(
            "border border-gray-500 hover:border hover:border-purple-600",
            "transition-colors duration-300",
            {
              "border-red-400 focus:border-red-400 hover:border-red-400":
                fieldState.error,
            }
          )}
          textareaProps={{
            id: name,
            name,
            maxLength: maxLength ? ++maxLength : undefined,
            onChange: (event) => {
              field.onChange(event);
              onChange?.(event);
            },
            value: value || field.value,
          }}
          {...field}
          ref={MDEditorRef}
        />
      </div>

      {!!fieldState.error && (
        <Typography.Text size="xs" color="red">
          {fieldState.error.message}
        </Typography.Text>
      )}
    </div>
  );
};
