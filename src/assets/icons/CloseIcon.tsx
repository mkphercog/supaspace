export const CloseIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={`shrink-0 ${className}`}
    >
      <g fill="none">
        <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.25" />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
          d="m16 8l-8 8m0-8l8 8"
        />
      </g>
    </svg>
  );
};
