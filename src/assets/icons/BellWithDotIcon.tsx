import type { SVGProps } from "react";

export function BellWithDotIcon({
  dotClassNames,
  ...props
}: SVGProps<SVGSVGElement> & { dotClassNames?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path
          fill="currentColor"
          d="M12 2a7 7 0 0 1 2.263.374a4.5 4.5 0 0 0 4.5 7.447L19 9.743v2.784a1 1 0 0 0 .06.34l.046.107l1.716 3.433a1.1 1.1 0 0 1-.869 1.586l-.115.006H4.162a1.1 1.1 0 0 1-1.03-1.487l.046-.105l1.717-3.433a1 1 0 0 0 .098-.331L5 12.528V9a7 7 0 0 1 7-7"
        />

        <path
          fill="currentColor"
          className={dotClassNames}
          d="M17.5 3a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
        />

        <path
          fill="currentColor"
          d="M12 21a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 12 21"
        />
      </g>
    </svg>
  );
}
