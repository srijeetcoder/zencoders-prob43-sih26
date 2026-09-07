import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="container-page flex h-18 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/sample-assets/logo.png"
            alt="JanSahyog - People. Ideas. Solutions."
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a
            href="#top"
            className="relative text-[#148554] font-semibold py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#148554] after:rounded-full"
          >
            Home
          </a>
          <a href="#challenges" className="hover:text-[#148554] transition-colors py-1">
            Explore Problems
          </a>
          <a href="#stories" className="hover:text-[#148554] transition-colors py-1">
            Success Stories
          </a>
          <a href="#how" className="hover:text-[#148554] transition-colors py-1">
            For Universities
          </a>
          <a href="#partners" className="hover:text-[#148554] transition-colors py-1">
            For Industry
          </a>
          <a href="#about" className="hover:text-[#148554] transition-colors py-1">
            About
          </a>
        </nav>

        {/* Search Bar & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden md:block w-64 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, topics, locations..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#148554] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Login Button */}
          <button
            type="button"
            className="hidden sm:inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Login
          </button>

          {/* Get Started Button */}
          <Link
            to="/get-started"
            className="rounded-lg bg-[#047d48] hover:bg-[#03663a] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:shadow-sm"
          >
            Get Started
          </Link>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 lg:hidden shadow-lg space-y-3">
          <div className="relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, locations..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs text-gray-800"
            />
          </div>

          <a
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-semibold text-[#148554]"
          >
            Home
          </a>
          <a
            href="#challenges"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            Explore Problems
          </a>
          <a
            href="#stories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            Success Stories
          </a>
          <a
            href="#how"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            For Universities
          </a>
          <a
            href="#partners"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            For Industry
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            About
          </a>

          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <button className="w-1/2 rounded-lg border border-gray-300 py-2 text-xs font-semibold text-gray-700">
              Login
            </button>
            <Link
              to="/get-started"
              onClick={() => setMobileMenuOpen(false)}
              className="w-1/2 rounded-lg bg-[#047d48] py-2 text-center text-xs font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}