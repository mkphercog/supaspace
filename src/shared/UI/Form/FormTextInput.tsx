import cn from "classnames";
import { FC, InputHTMLAttributes } from "react";
import { useController } from "react-hook-form";

import { Typography } from "src/shared/UI";

type FromTextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  labelText: string;
  name: string;
  maxLength?: number;
  isRequired?: boolean;
  showCounter?: boolean;
  isLoading?: boolean;
};

export const FormTextInput: FC<FromTextInputProps> = ({
  labelText,
  name,
  className,
  maxLength,
  isRequired = false,
  showCounter = true,
  onChange,
  value,
  ...restProps
}) => {
  const { field, fieldState } = useController({ name });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div>
        <label htmlFor={name} className="block mb-1">
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
        <input
          id={name}
          type="text"
          className={cn(
            "w-full p-2 block text-sm rounded-md",
            "border border-gray-500 hover:border-purple-600 focus:border-purple-600",
            "bg-transparent focus:outline-none",
            "transition-colors duration-300 hover:cursor-text",
            {
              "border-red-400 focus:border-red-400 hover:border-red-400":
                fieldState.error,
            }
          )}
          {...field}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
          maxLength={maxLength ? ++maxLength : undefined}
          value={value || field.value}
          {...restProps}
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
