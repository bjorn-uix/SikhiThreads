export default function YarnDivider({ color = '#D4A574', className = '' }) {
  return (
    <div className={`w-full overflow-hidden py-4 ${className}`}>
      <svg viewBox="0 0 1200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
        <path
          d="M0 20 Q50 5 100 20 Q150 35 200 20 Q250 5 300 20 Q350 35 400 20 Q450 5 500 20 Q550 35 600 20 Q650 5 700 20 Q750 35 800 20 Q850 5 900 20 Q950 35 1000 20 Q1050 5 1100 20 Q1150 35 1200 20"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="thread-draw"
          opacity="0.6"
        />
        {/* Small yarn knots at intervals */}
        <circle cx="200" cy="20" r="3" fill={color} opacity="0.5" />
        <circle cx="600" cy="20" r="3" fill={color} opacity="0.5" />
        <circle cx="1000" cy="20" r="3" fill={color} opacity="0.5" />
      </svg>
    </div>
  )
}

export function YarnBall({ size = 60, color = '#D4A574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
      <circle cx="30" cy="30" r="25" fill={color} opacity="0.15" />
      <circle cx="30" cy="30" r="25" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M15 25 Q30 15 45 25" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M12 32 Q30 22 48 32" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M15 38 Q30 28 45 38" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M20 18 Q30 38 40 18" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      {/* Thread tail */}
      <path d="M45 20 Q55 15 52 8 Q48 2 55 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}
