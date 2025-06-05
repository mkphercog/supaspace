import type { SVGProps } from "react";

export function CoffeeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillOpacity={0}
        d="M17 14v4c0 1.66 -1.34 3 -3 3h-6c-1.66 0 -3 -1.34 -3 -3v-4Z"
      >
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="0.72s"
          dur="0.135s"
          values="0;0.3"
        ></animate>
      </path>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path
          strokeDasharray={48}
          strokeDashoffset={48}
          d="M17 9v9c0 1.66 -1.34 3 -3 3h-6c-1.66 0 -3 -1.34 -3 -3v-9Z"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.54s"
            values="48;0"
          ></animate>
        </path>
        <path
          strokeDasharray={14}
          strokeDashoffset={14}
          d="M17 9h3c0.55 0 1 0.45 1 1v3c0 0.55 -0.45 1 -1 1h-3"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.54s"
            dur="0.18s"
            values="14;0"
          ></animate>
        </path>
        <mask id="lineMdCoffeeHalfEmptyTwotoneLoop0">
          <path
            stroke="#fff"
            d="M8 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M16 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4"
          >
            <animateMotion
              calcMode="linear"
              dur="2.7s"
              path="M0 0v-8"
              repeatCount="indefinite"
            ></animateMotion>
          </path>
        </mask>
        <rect
          width={24}
          height={0}
          y={7}
          fill="currentColor"
          mask="url(#lineMdCoffeeHalfEmptyTwotoneLoop0)"
        >
          <animate
            fill="freeze"
            attributeName="y"
            begin="0.72s"
            dur="0.54s"
            values="7;2"
          ></animate>
          <animate
            fill="freeze"
            attributeName="height"
            begin="0.72s"
            dur="0.54s"
            values="0;5"
          ></animate>
        </rect>
      </g>
    </svg>
  );
}
