// Decorative floating tarot cards for the hero background.
// Pure CSS animation (see .float-card-* in globals.css). Rendered behind
// the hero text at low opacity so it never competes with the copy.

const stroke = '#B76E79'

function CardFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="6" y="6" width="188" height="288" rx="12" stroke={stroke} strokeWidth="1.5" fill="rgba(15,18,41,0.35)" />
      <rect x="16" y="16" width="168" height="268" rx="8" stroke={stroke} strokeWidth="0.7" fill="none" />
      {children}
    </svg>
  )
}

// The Moon
function MoonCard() {
  return (
    <CardFrame>
      <circle cx="100" cy="120" r="32" stroke={stroke} strokeWidth="1.2" fill="none" />
      <circle cx="88" cy="115" r="26" stroke={stroke} strokeWidth="1" fill="none" />
      <circle cx="70" cy="170" r="1.8" fill={stroke} />
      <circle cx="132" cy="178" r="1.4" fill={stroke} />
      <circle cx="85" cy="195" r="1" fill={stroke} />
      <circle cx="120" cy="160" r="1.4" fill={stroke} />
      <path d="M45 235 Q72 222 100 235 Q128 248 155 235" stroke={stroke} strokeWidth="0.9" fill="none" />
      <path d="M45 248 Q72 235 100 248 Q128 261 155 248" stroke={stroke} strokeWidth="0.7" fill="none" />
      <text x="100" y="278" textAnchor="middle" fontFamily="serif" fontSize="10" letterSpacing="2.5" fill={stroke}>THE MOON</text>
    </CardFrame>
  )
}

// The Star
function StarCard() {
  return (
    <CardFrame>
      <text x="100" y="46" textAnchor="middle" fontFamily="serif" fontSize="12" letterSpacing="2" fill={stroke}>XVII</text>
      <polygon points="100,66 107,100 141,100 114,122 123,157 100,138 77,157 86,122 59,100 93,100" stroke={stroke} strokeWidth="1.1" fill="none" />
      <circle cx="62" cy="72" r="2.5" stroke={stroke} strokeWidth="0.7" fill="none" />
      <circle cx="140" cy="78" r="2" stroke={stroke} strokeWidth="0.7" fill="none" />
      <circle cx="66" cy="150" r="1.6" stroke={stroke} strokeWidth="0.7" fill="none" />
      <circle cx="138" cy="146" r="1.6" stroke={stroke} strokeWidth="0.7" fill="none" />
      <path d="M50 210 Q78 197 100 210 Q125 223 150 210" stroke={stroke} strokeWidth="0.9" fill="none" />
      <path d="M55 226 Q82 214 108 226 Q132 236 148 226" stroke={stroke} strokeWidth="0.7" fill="none" />
      <text x="100" y="278" textAnchor="middle" fontFamily="serif" fontSize="10" letterSpacing="2.5" fill={stroke}>THE STAR</text>
    </CardFrame>
  )
}

// The Sun
function SunCard() {
  return (
    <CardFrame>
      <text x="100" y="46" textAnchor="middle" fontFamily="serif" fontSize="12" letterSpacing="2" fill={stroke}>XIX</text>
      <circle cx="100" cy="120" r="30" stroke={stroke} strokeWidth="1.2" fill="none" />
      <circle cx="100" cy="120" r="15" stroke={stroke} strokeWidth="0.9" fill="none" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const x1 = 100 + Math.cos(angle) * 34
        const y1 = 120 + Math.sin(angle) * 34
        const x2 = 100 + Math.cos(angle) * 44
        const y2 = 120 + Math.sin(angle) * 44
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="0.8" />
      })}
      <path d="M55 210 Q82 200 108 210 Q132 220 150 210" stroke={stroke} strokeWidth="0.8" fill="none" />
      <text x="100" y="278" textAnchor="middle" fontFamily="serif" fontSize="10" letterSpacing="2.5" fill={stroke}>THE SUN</text>
    </CardFrame>
  )
}

export function FloatingCards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Left cluster */}
      <div className="float-card-c absolute left-[4%] top-[30%] hidden h-40 w-28 opacity-20 lg:block xl:h-52 xl:w-36">
        <SunCard />
      </div>
      <div className="float-card-a absolute left-[10%] top-[18%] hidden h-52 w-36 opacity-30 lg:block xl:h-64 xl:w-44">
        <MoonCard />
      </div>
      {/* Right cluster */}
      <div className="float-card-b absolute right-[8%] top-[20%] hidden h-56 w-40 opacity-30 lg:block xl:h-64 xl:w-44">
        <StarCard />
      </div>
      <div className="float-card-c absolute right-[3%] top-[40%] hidden h-40 w-28 opacity-20 lg:block xl:h-52 xl:w-36">
        <MoonCard />
      </div>
    </div>
  )
}
