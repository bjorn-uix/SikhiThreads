export default function CrochetPattern({ variant = 'yarn', opacity = 0.05 }) {
  const patterns = {
    yarn: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="yarn-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30 Q15 25 30 30 Q45 35 60 30" fill="none" stroke="#D4A574" strokeWidth="0.5" />
            <path d="M0 45 Q15 40 30 45 Q45 50 60 45" fill="none" stroke="#D4A574" strokeWidth="0.5" />
            <path d="M0 15 Q15 10 30 15 Q45 20 60 15" fill="none" stroke="#D4A574" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#yarn-pattern)" />
      </svg>
    ),
    knit: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="knit-pattern" x="0" y="0" width="16" height="20" patternUnits="userSpaceOnUse">
            <path d="M4 0 L8 10 L12 0" fill="none" stroke="#8B6F47" strokeWidth="0.5" />
            <path d="M-4 10 L0 20 L4 10" fill="none" stroke="#8B6F47" strokeWidth="0.5" />
            <path d="M12 10 L16 20 L20 10" fill="none" stroke="#8B6F47" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#knit-pattern)" />
      </svg>
    ),
    stitch: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="stitch-pattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="3" y1="3" x2="9" y2="9" stroke="#D4A574" strokeWidth="0.5" />
            <line x1="9" y1="3" x2="3" y2="9" stroke="#D4A574" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stitch-pattern)" />
      </svg>
    ),
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {patterns[variant] || patterns.yarn}
    </div>
  )
}
