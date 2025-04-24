import { ChangeEventHandler, FC } from "react";
import { useController } from "react-hook-form";
import { Typography } from "../../Typography";

type FormImageInputProps = {
  labelText: string;
  name: string;
  className?: string;
  isRequired?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  value?: string | number | readonly string[] | undefined;
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
  value,
  placeholder,
}) => {
  const { field, fieldState } = useController({ name });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div>
        <label htmlFor={name} className="block mb-1">
          <Typography.Text size="sm">
            {labelText} {isRequired && "*"}
          </Typography.Text>
        </label>
        <input
          id={name}
          type="file"
          className={`
            w-full text-sm rounded-md p-2 block         
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-transparent focus:border-purple-600
            transition-colors duration-300
            hover:cursor-pointer file:hidden
          `}
          {...field}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
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
