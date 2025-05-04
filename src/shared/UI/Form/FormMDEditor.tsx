import MDEditor, { RefMDEditor } from "@uiw/react-md-editor";
import { FC, TextareaHTMLAttributes, useRef } from "react";
import { useController } from "react-hook-form";

import { Typography } from "src/shared/UI";

type FromMDEditorProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  labelText: string;
  name: string;
  maxLength?: number;
  isRequired?: boolean;
  showCounter?: boolean;
  isLoading?: boolean;
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
          className={`
            transition-colors duration-300
            border border-gray-500 hover:border hover:border-purple-600
            ${
              fieldState.error
                ? "border-red-400 focus:border-red-400 hover:border-red-400"
                : ""
            }
          `}
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
