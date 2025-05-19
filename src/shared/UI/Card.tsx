import cn from "classnames";
import { FC, PropsWithChildren, Ref } from "react";

import { Loader } from "src/shared/UI";

type CardShadowVariant = "basic" | "withHover" | "noColors";
type CartContainerVariant = "basic" | "purple";

type CardProps = {
  ref?: Ref<HTMLElement>;
  isLoading?: boolean;
  className?: string;
  containerClassName?: string;
  shadowVariant?: CardShadowVariant;
  containerVariant?: CartContainerVariant;
};

const SHADOW_VARIANTS: Record<CardShadowVariant, string> = {
  basic: "bg-gradient-to-r from-pink-700 to-purple-700 opacity-15",
  withHover:
    "bg-gradient-to-r from-pink-700 to-purple-700 opacity-0 group-hover:opacity-20 transition duration-300",
  noColors: "border-purple-600",
};

const CONTAINER_VARIANTS: Record<CartContainerVariant, string> = {
  basic: "border-white/10",
  purple: "border-purple-500/40",
};

export const Card: FC<PropsWithChildren<CardProps>> = ({
  ref,
  isLoading,
  className,
  containerClassName,
  children,
  shadowVariant = "basic",
  containerVariant = "basic",
}) => {
  return (
    <section ref={ref} className={`relative group ${className}`}>
      <div
        className={cn(
          "absolute -inset-1",
          "rounded-2xl blur-xs pointer-events-none",
          SHADOW_VARIANTS[shadowVariant]
        )}
      />
      <div
        className={cn(
          "relative h-full p-3 md:p-4 flex flex-col gap-3",
          "border bg-[rgba(12,13,15,0.88)] rounded-2xl",
          CONTAINER_VARIANTS[containerVariant],
          containerClassName
        )}
      >
        {children}
      </div>

      {isLoading && (
        <Loader className="absolute top-0 bottom-0 left-0 right-0 p-20 bg-[rgba(12,13,15,0.88)]" />
      )}
    </section>
  );
};
