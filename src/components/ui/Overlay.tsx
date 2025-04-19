import { FC, PropsWithChildren, Ref } from "react";

type OverlayProps = {
  onClick?: () => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

export const Overlay: FC<PropsWithChildren<OverlayProps>> = ({
  onClick,
  children,
  className,
  ref,
}) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`fixed inset-0 bg-gray-950/90 z-[1000] flex flex-col items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
};
