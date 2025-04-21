import { ChangeEventHandler, FC } from "react";
import { useController } from "react-hook-form";
import { Typography } from "../../Typography";

type FromTextInputProps = {
  labelText: string;
  name: string;
  className?: string;
  maxLength?: number;
  isRequired?: boolean;
  showCounter?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  value?: string | number | readonly string[] | undefined;
  isLoading?: boolean;
  placeholder?: string;
};

export const FormTextInput: FC<FromTextInputProps> = ({
  labelText,
  name,
  className,
  maxLength,
  isRequired = false,
  showCounter = true,
  onChange,
  disabled,
  value,
  placeholder,
}) => {
  const { field, fieldState } = useController({ name });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div>
        <label htmlFor={name} className="block mb-1">
          <div className="flex justify-between items-end">
            <Typography.Text size="sm">
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
          className={`
            w-full text-sm rounded-md p-2 block         
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-transparent focus:border-purple-600
            transition-colors duration-300
            hover:cursor-text
          `}
          {...field}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
          maxLength={maxLength ? maxLength + 10 : undefined}
          value={value || field.value}
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
