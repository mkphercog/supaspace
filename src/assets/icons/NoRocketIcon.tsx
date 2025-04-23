import type { SVGProps } from "react";

export function NoRocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path d="M9.29 9.275A9 9 0 0 0 9 10a6 6 0 0 0-5 3a8 8 0 0 1 7 7a6 6 0 0 0 3-5q.362-.128.708-.283m2.428-1.61A9 9 0 0 0 20 7a3 3 0 0 0-3-3a9 9 0 0 0-6.107 2.864"></path>
        <path d="M7 14a6 6 0 0 0-3 6a6 6 0 0 0 6-3m4-8a1 1 0 1 0 2 0a1 1 0 1 0-2 0M3 3l18 18"></path>
      </g>
    </svg>
  );
}
