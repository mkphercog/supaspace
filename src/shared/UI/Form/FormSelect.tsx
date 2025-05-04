import { FC, SelectHTMLAttributes } from "react";
import { useController } from "react-hook-form";

import { Typography } from "src/shared/UI";

type FromSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  labelText: string;
  name: string;
  maxLength?: number;
  isRequired?: boolean;
  showCounter?: boolean;
  isLoading?: boolean;
  optionList: {
    id: string | number;
    value: string;
  }[];
};

export const FormSelect: FC<FromSelectProps> = ({
  labelText,
  name,
  className,
  maxLength,
  isRequired = false,
  showCounter = true,
  onChange,
  value,
  optionList,
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
        <select
          id={name}
          className={`
            w-full text-sm rounded-md p-2 block
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-[rgba(10,10,10,0.8)] text-gray-200 focus:border-purple-600
            transition-colors duration-300
            hover:cursor-pointer
            ${
              fieldState.error
                ? "border-red-400 focus:border-red-400 hover:border-red-400"
                : ""
            }
          `}
          {...field}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
          value={value || field.value}
          {...restProps}
        >
          <option value={-1}> - </option>
          {optionList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.value}
            </option>
          ))}
        </select>
      </div>

      {!!fieldState.error && (
        <Typography.Text size="xs" color="red">
          {fieldState.error.message}
        </Typography.Text>
      )}
    </div>
  );
};
