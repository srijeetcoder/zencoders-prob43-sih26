import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, CheckCircle2 } from 'lucide-react'

export default function Footer({ large = false }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="border-t border-line bg-paper py-14 sm:py-16">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 pb-12 border-b border-line">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/sample-assets/logo.png"
                alt="JanSahyog - People. Ideas. Solutions."
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className={`${large ? 'text-sm' : 'text-xs'} leading-relaxed text-ink-2 max-w-sm`}>
              Connecting citizen bottlenecks, gram panchayats, and state ministries
              with top Indian university research labs and corporate CSR scale.
            </p>

            <div className={`inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-1 ${large ? 'text-[13px]' : 'text-[11px]'} text-ink-3`}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 28 State Ledger Nodes Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <p className={`${large ? 'text-sm' : 'text-xs'} font-bold uppercase tracking-wider text-ink`}>
              Platform
            </p>
            <ul className={`${large ? 'text-sm' : 'text-xs'} text-ink-2 space-y-2`}>
              <li>
                <a href="#challenges" className="hover:text-accent transition-colors">
                  Open Challenges
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-accent transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#stories" className="hover:text-accent transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-accent transition-colors">
                  Partner Network
                </a>
              </li>
              <li>
                <Link to="/get-started" className="hover:text-accent transition-colors">
                  Submit a Challenge
                </Link>
              </li>
            </ul>
          </div>

          {/* Stakeholder Portals */}
          <div className="lg:col-span-2 space-y-3">
            <p className={`${large ? 'text-sm' : 'text-xs'} font-bold uppercase tracking-wider text-ink`}>
              Stakeholders
            </p>
            <ul className={`${large ? 'text-sm' : 'text-xs'} text-ink-2 space-y-2`}>
              <li>
                <Link to="/get-started" className="hover:text-accent transition-colors">
                  For Citizens
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="hover:text-accent transition-colors">
                  Gram Panchayats
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="hover:text-accent transition-colors">
                  State Ministries
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="hover:text-accent transition-colors">
                  University Labs
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="hover:text-accent transition-colors">
                  Industry & CSR
                </Link>
              </li>
            </ul>
          </div>

          {/* Weekly Ledger Bulletin */}
          <div className="lg:col-span-4 space-y-3">
            <p className={`${large ? 'text-sm' : 'text-xs'} font-bold uppercase tracking-wider text-ink`}>
              Weekly Challenge Digest
            </p>
            <p className={`${large ? 'text-sm' : 'text-xs'} text-ink-2`}>
              Receive a curated briefing of new verified societal challenges matching your domain or district.
            </p>

            {subscribed ? (
              <div className={`flex items-center gap-2 rounded-xl bg-olive/15 p-3 ${large ? 'text-sm' : 'text-xs'} text-olive font-medium`}>
                <CheckCircle2 className="h-4 w-4" />
                <span>Subscribed! You will receive the weekly Friday digest.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className={`w-full rounded-xl border border-line bg-paper-2 px-3 py-2 ${large ? 'text-sm' : 'text-xs'} text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none`}
                />
                <button
                  type="submit"
                  className={`rounded-xl bg-accent px-4 py-2 ${large ? 'text-sm' : 'text-xs'} font-semibold text-white hover:bg-accent-deep transition-colors`}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            <p className={`font-mono ${large ? 'text-[13px]' : 'text-[10px]'} text-ink-3 uppercase`}>
              No spam · Public interest notifications only
            </p>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className={`mt-8 flex flex-wrap items-center justify-between gap-4 ${large ? 'text-sm' : 'text-xs'} text-ink-3`}>
          <p className={`font-mono ${large ? 'text-[13px]' : 'text-[11px]'} uppercase tracking-wider`}>
            Zencoders Ledger © {new Date().getFullYear()} · People · Ideas · Solutions
          </p>

          <p className="flex items-center gap-1.5">
            <span>Engineered with passion for societal impact</span>
          </p>
        </div>
      </div>
    </footer>
  )
}