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
          className={`
            w-full text-sm rounded-md p-2 block         
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-transparent focus:border-purple-600
            transition-colors duration-300
            hover:cursor-pointer file:hidden
            ${
              fieldState.error
                ? "border-red-400 focus:border-red-400 hover:border-red-400"
                : ""
            }
          `}
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
