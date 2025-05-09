import cn from "classnames";
import { ChangeEventHandler, FC } from "react";
import { useController } from "react-hook-form";

import { Typography } from "src/shared/UI";

type FormImageInputProps = {
  labelText: string;
  name: string;
  className?: string;
  isRequired?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
};

export const FormImageInput: FC<FormImageInputProps> = ({
  labelText,
  name,
  className,
  isRequired = false,
  onChange,
  disabled,
  placeholder,
}) => {
  const { field, fieldState } = useController({ name });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div>
        <label htmlFor={name} className="block mb-1">
          <Typography.Text size="sm" className="font-semibold">
            {labelText} {isRequired && "*"}
          </Typography.Text>
        </label>
        <input
          id={name}
          type="file"
          accept="image/*"
          className={cn(
            "w-full p-2 block text-sm rounded-md",
            "border border-gray-500 hover:border-purple-600 focus:border-purple-600 ",
            "bg-transparent focus:outline-none transition-colors duration-300 hover:cursor-pointer file:hidden",
            {
              "border-red-400 focus:border-red-400 hover:border-red-400":
                fieldState.error,
            }
          )}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              field.onChange(file);
            } else {
              field.onChange(undefined);
            }
            onChange?.(event);
          }}
          disabled={disabled}
          placeholder={placeholder}
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
