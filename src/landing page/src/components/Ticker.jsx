import React from 'react'
import { PROBLEMS } from '../data/problemsData'

export default function Ticker() {
  return (
    <div
      className="overflow-hidden border-b border-line bg-paper-2 py-3"
      aria-hidden="true"
    >
      <div className="ticker-track font-mono text-xs tracking-wider text-ink-3 uppercase">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {PROBLEMS.map((p) => (
              <span
                key={`${p.id}-${k}`}
                className="flex shrink-0 items-center whitespace-nowrap gap-2"
              >
                <span className="font-bold text-accent">{p.id}</span>
                <span className="text-ink-2 font-sans font-medium">{p.title}</span>
                <span className="rounded-full bg-paper-3 px-2 py-0.5 text-[10px] text-ink-3">
                  {p.place.split('·')[0]}
                </span>
                <span className="mx-6 inline-block h-1.5 w-1.5 rotate-45 bg-accent/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}