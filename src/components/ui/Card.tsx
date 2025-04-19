import { FC, PropsWithChildren } from "react";

type CardProps = {
  withHover?: boolean;
  className?: string;
};

export const Card: FC<PropsWithChildren<CardProps>> = ({
  withHover = false,
  children,
}) => {
  const classNames = withHover
    ? "opacity-0 group-hover:opacity-50 transition duration-300"
    : "opacity-20";

  return (
    <section className="relative group">
      <div
        className={`
          absolute -inset-1 
          rounded-2xl blur-sm pointer-events-none
          bg-gradient-to-r from-pink-600 to-purple-600 
          ${classNames}
        `}
      />

      <div
        className={`
          relative h-full 
          flex flex-col gap-3 
          border border-white/10 p-5 bg-[rgba(12,13,15,0.9)] 
          rounded-2xl 
        `}
      >
        {children}
      </div>
    </section>
  );
};
