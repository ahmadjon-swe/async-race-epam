interface CarIconProps {
  color: string;
  width?: number;
}

export function CarIcon({ color, width = 80 }: CarIconProps) {
  return (
    <svg
      width={width}
      viewBox="0 0 100 45"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="5" y="22" width="90" height="16" rx="4" fill={color} />
      <path d="M 22 22 L 34 8 L 66 8 L 78 22 Z" fill={color} />
      <rect x="36" y="10" width="12" height="10" rx="1" fill="rgba(180,230,255,0.7)" />
      <rect x="52" y="10" width="12" height="10" rx="1" fill="rgba(180,230,255,0.7)" />
      <circle cx="26" cy="38" r="7" fill="#222" />
      <circle cx="26" cy="38" r="3" fill="#555" />
      <circle cx="74" cy="38" r="7" fill="#222" />
      <circle cx="74" cy="38" r="3" fill="#555" />
    </svg>
  );
}
