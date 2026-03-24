interface InkwellLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export const InkwellLogo = ({ size = 24, color = 'currentColor', className = '' }: InkwellLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Feather body — elegant filled silhouette */}
      <path
        d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
        fill={color}
        stroke="none"
        opacity={0.12}
      />
      {/* Feather outline — crisp strokes */}
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      {/* Quill spine */}
      <line x1="16" y1="8" x2="2" y2="22" />
      {/* Barb lines */}
      <line x1="17.5" y1="15" x2="9" y2="15" />
      <line x1="13" y1="19" x2="9" y2="19" opacity={0.5} />
    </svg>
  );
};
