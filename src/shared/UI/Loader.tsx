import type { SVGProps } from "react";

export function Loader({ className, ...restProps }: SVGProps<SVGSVGElement>) {
  return (
    <div
      role="status"
      className={`w-full flex items-center justify-center ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-[120px] h-auto text-purple-600"
        viewBox="0 0 24 24"
        {...restProps}
      >
        <circle cx={18} cy={12} r={0} fill="currentColor">
          <animate
            attributeName="r"
            begin="0.603s"
            calcMode="spline"
            dur="1.35s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          ></animate>
        </circle>
        <circle cx={12} cy={12} r={0} fill="currentColor">
          <animate
            attributeName="r"
            begin="0.297s"
            calcMode="spline"
            dur="1.35s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          ></animate>
        </circle>
        <circle cx={6} cy={12} r={0} fill="currentColor">
          <animate
            attributeName="r"
            begin={0}
            calcMode="spline"
            dur="1.35s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          ></animate>
        </circle>
      </svg>
    </div>
  );
}
