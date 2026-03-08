interface OnneFitIconProps {
  className?: string;
  color?: string;
}

/**
 * Icon-only brand mark — flame/soul shape.
 * Pass `color` to override; defaults to currentColor.
 */
export function OnneFitIcon({ className, color = "currentColor" }: OnneFitIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Onne Fit"
    >
      <path
        d="M24 4C24 4 14 16 14 26C14 31.2 17 35.4 21 37.4C19 35 18 32 18 28.8C18 22.4 24 16 24 16C24 16 30 22.4 30 28.8C30 32 29 35 27 37.4C31 35.4 34 31.2 34 26C34 16 24 4 24 4Z"
        fill={color}
      />
    </svg>
  );
}
