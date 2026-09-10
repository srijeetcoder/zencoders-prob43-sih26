const INK = 'var(--color-ink)'
const INK2 = 'var(--color-ink-2)'
const INK3 = 'var(--color-ink-3)'
const LINE = 'var(--color-line)'
const LINE_STRONG = 'var(--color-line-strong)'
const SOFT = 'var(--color-paper-2)'
const WASH = 'var(--color-accent-wash)'
const ACCENT = 'var(--color-accent)'
const SUN = 'var(--color-sun)'

export function LedgerMark({ className = '' }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <rect x="2" y="2" width="8" height="8" rx="1.5" transform="rotate(45 6 6)" fill={ACCENT} />
    </svg>
  )
}

export function WaterPlate({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 210"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M-4 190 C 56 156 118 178 168 166 C 224 153 268 172 324 154 L 324 210 L -4 210 Z"
        fill={SOFT}
      />
      <path
        d="M-4 190 C 56 156 118 178 168 166 C 224 153 268 172 324 154"
        fill="none"
        stroke={LINE_STRONG}
        strokeWidth="1.5"
      />

      <g stroke={SUN} strokeWidth="2" strokeLinecap="round" fill="none">
        <circle cx="260" cy="50" r="13" />
        <path d="M260 26v-5M260 74v5M239 41h-5M281 41h5M242 32l-4-4M278 32l4-4M242 68l-4 4M278 68l4 4" />
      </g>

      <g fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
        <path d="M200 104 L 272 78 L 284 96 L 212 122 Z" fill={WASH} />
        <path d="M224 95 L 236 113 M248 87 L 260 105" />
        <path d="M206 113 L 203 148 M207 116 L 208 148" />
      </g>

      <g fill="none" stroke={INK2} strokeWidth="2" strokeLinecap="round">
        <path d="M86 56 L 86 148 M94 56 L 94 148 M84 56 L 96 56" />
        <path d="M86 82 C 70 84 58 90 52 98" />
        <path d="M49 96 L 53 100 L 47 104" strokeWidth="1.8" />
        <path d="M86 56 C 80 50 72 46 62 42" strokeWidth="2.4" />
        <circle cx="60" cy="42" r="4.4" />
        <circle cx="90" cy="64" r="2" />
        <path d="M76 146 L 104 146" strokeWidth="2.6" />
      </g>

      <g fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 4">
        <path d="M50 104 C 42 122 36 136 32 148" />
        <path d="M42 126 C 38 134 34 142 32 148" />
      </g>

      <g fill="none" stroke={INK2} strokeWidth="2" strokeLinecap="round">
        <path d="M18 150 Q 30 163 64 152" />
        <path d="M26 146 L 30 154 M38 147 L 38 155" strokeWidth="1.5" />
      </g>

      <path d="M12 148 L 308 148" stroke={LINE_STRONG} strokeWidth="1.5" />
      <g stroke={INK3} strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M30 148 v4 M132 148 v4 M172 148 v4 M234 148 v4 M292 148 v4" />
      </g>
      <g stroke={LINE_STRONG} strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M150 60 l -7 -3 M147 63 l -7 -2" />
        <path d="M198 50 l 7 -3 M201 53 l 7 -2" />
      </g>
    </svg>
  )
}

export function CampusPlate({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 210"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M-4 180 L 324 180" stroke={LINE_STRONG} strokeWidth="1.5" />

      <g fill={SOFT} stroke={INK2} strokeWidth="2">
        <rect x="40" y="32" width="158" height="84" rx="4" />
      </g>
      <rect x="46" y="38" width="146" height="72" rx="2" fill="none" stroke={LINE} strokeWidth="1.2" />

      <g fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M66 60 v12 M82 56 v12 M98 60 v12" />
        <path d="M56 88 L 116 88" strokeWidth="1.6" />
        <path d="M126 84 C 120 84 116 90 116 95 A 10 10 0 0 0 136 95 C 136 90 132 84 126 84 Z" strokeWidth="1.8" />
        <path d="M144 92 L 158 80 M158 80 l -6 1 M158 80 l 1 6" />
      </g>

      <g fill={SOFT} stroke={INK2} strokeWidth="2">
        <path d="M212 178 L 214 138 L 268 138 L 270 178 Z" />
      </g>
      <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
        <circle cx="244" cy="62" r="10" />
        <path d="M226 80 C 232 90 256 90 262 80" strokeWidth="2.4" />
        <path d="M254 70 L 286 94" strokeWidth="1.8" />
        <circle cx="287" cy="95" r="2.4" />
      </g>

      <g fill={SOFT} stroke={INK2} strokeWidth="2">
        <rect x="250" y="26" width="52" height="34" rx="2" />
      </g>
      <g fill="none" stroke={INK2} strokeWidth="1.4">
        <path d="M276 26 v34 M250 43 h52" />
      </g>
      <g fill="none" stroke={SUN} strokeWidth="1.6" strokeLinecap="round">
        <path d="M302 36 l 12 -4 M302 43 l 12 0 M302 50 l 12 4" />
      </g>

      <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
        <path d="M44 166 L 196 166" strokeWidth="2.4" />
        <path d="M64 166 v14 M98 166 v14 M132 166 v14 M166 166 v14" strokeWidth="1.7" />
        <circle cx="72" cy="150" r="7" />
        <circle cx="106" cy="150" r="7" />
        <circle cx="140" cy="150" r="7" />
        <circle cx="174" cy="150" r="7" />
        <path d="M66 157 c 2 6 10 6 12 0 M100 157 c 2 6 10 6 12 0 M134 157 c 2 6 10 6 12 0 M168 157 c 2 6 10 6 12 0" strokeWidth="1.6" />
      </g>
    </svg>
  )
}

export function IndustryPlate({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 210"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill={SOFT} stroke={INK2} strokeWidth="2" strokeLinejoin="round">
        <path d="M36 98 L 54 84 L 72 98 L 90 84 L 108 98 L 120 98 L 120 156 L 36 156 Z" />
        <rect x="98" y="44" width="10" height="54" />
      </g>
      <path d="M78 128 L 94 128 L 94 156 L 78 156 Z" fill="none" stroke={INK2} strokeWidth="1.6" />
      <g fill="none" stroke={INK3} strokeWidth="1.4">
        <rect x="52" y="112" width="11" height="11" rx="1.5" />
        <rect x="68" y="112" width="11" height="11" rx="1.5" />
      </g>

      <g fill="none" stroke={LINE_STRONG} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 5">
        <path d="M104 42 C 112 34 114 28 110 20" />
        <path d="M112 38 C 120 30 122 24 118 16" />
      </g>

      <path
        d="M120 118 C 148 122 158 126 178 126"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.8"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      <g fill="none" stroke={INK2} strokeWidth="2" strokeLinecap="round">
        <circle cx="218" cy="118" r="30" />
        <path d="M248 118 h8 M239 139 l6 6 M218 148 v8 M197 139 l-6 6 M188 118 h-8 M197 97 l-6 -6 M218 88 v-8 M239 97 l6 -6" />
        <circle cx="218" cy="118" r="7" />
        <path d="M224 124 l12 12 M212 124 l-12 12 M212 112 l-12 -12 M224 112 l12 -12" strokeWidth="1.6" />
      </g>

      <g fill="none" stroke={LINE_STRONG} strokeWidth="2" strokeLinecap="round">
        <circle cx="280" cy="86" r="12" />
        <path d="M292 86 h5 M286 96 l3 5 M274 96 l-3 5 M268 86 h-5 M274 76 l-3 -5 M286 76 l3 -5" strokeWidth="1.6" />
        <circle cx="280" cy="86" r="3" />
      </g>

      <g stroke={SUN} strokeWidth="2" strokeLinecap="round" fill="none">
        <circle cx="286" cy="34" r="10" />
        <path d="M286 14v-4M286 54v4M268 30h-4M304 30h4M272 20l-3-3M300 20l3-3M272 40l-3 3M300 40l3 3" />
      </g>

      <path d="M36 156 L 316 156" stroke={LINE_STRONG} strokeWidth="1.5" />
      <g stroke={INK3} strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M52 156 v4 M140 156 v4 M180 156 v4 M248 156 v4 M300 156 v4" />
      </g>
    </svg>
  )
}
