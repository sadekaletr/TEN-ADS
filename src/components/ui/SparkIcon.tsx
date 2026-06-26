export function SparkIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block shrink-0">
      <defs>
        <linearGradient id="sparkGradMain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0c97a" />
          <stop offset="50%" stopColor="#d4a855" />
          <stop offset="100%" stopColor="#9a6e20" />
        </linearGradient>
        <linearGradient id="sparkGradShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        fill="url(#sparkGradMain)"
        stroke="#9a6e20"
        strokeWidth="0.5"
      />
      <path d="M16 2L28 9L16 16L4 9L16 2Z" fill="url(#sparkGradShine)" />
      <path d="M16 9L20 13L16 23L12 13L16 9Z" fill="#1a1408" opacity="0.85" />
    </svg>
  );
}
