import { FC, PropsWithChildren, Ref } from "react";
import { Loader } from "../Loader";

type CardProps = {
  ref?: Ref<HTMLElement>;
  withHover?: boolean;
  isLoading?: boolean;
  className?: string;
};

export const Card: FC<PropsWithChildren<CardProps>> = ({
  ref,
  withHover = false,
  isLoading,
  className,
  children,
}) => {
  const classNames = withHover
    ? "opacity-0 group-hover:opacity-20 transition duration-300"
    : "opacity-10";

  return (
    <section ref={ref} className={`relative group ${className}`}>
      <div
        className={`
          absolute -inset-1 
          rounded-2xl blur-xs pointer-events-none
          bg-gradient-to-r from-pink-700 to-purple-700 
          ${classNames}
        `}
      />
      <div
        className={`
          relative h-full 
          flex flex-col gap-3 
          border border-white/10 p-5 bg-[rgba(12,13,15,0.88)] 
          rounded-2xl 
        `}
      >
        {children}
      </div>

      {isLoading && (
        <Loader className="absolute top-0 bottom-0 left-0 right-0 p-20 bg-[rgba(12,13,15,0.88)]" />
      )}
    </section>
  );
};
