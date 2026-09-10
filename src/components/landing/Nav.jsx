import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut, UserCheck, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Explore Problems', path: '/explore-problems', matchPaths: ['/explore-problems', '/problemlist'] },
  { name: 'AI Analysis', path: '/gov/ai-analysis', roles: ['government', 'admin'] },
  { name: 'Solution Matching', path: '/solution-matching' },
  { name: 'Gov Portal', path: '/gov' },
  { name: 'Stories', path: '/successstories' },
]

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const userRole = (user?.role || 'citizen').toLowerCase()
  const visibleNavLinks = NAV_LINKS.filter(
    (link) => !link.roles || link.roles.includes(userRole) || userRole === 'admin'
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="container-page flex h-18 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 select-none">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-slate-900">Poo</span>
            <span className="text-[#148554]">Kar</span>
          </span>
        </Link>

        {/* Desktop Navigation Links with Dynamic Active Indicator */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {visibleNavLinks.map((link) => {
            const isActive =
              link.path === location.pathname ||
              (link.matchPaths && link.matchPaths.includes(location.pathname))

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-1 transition-all ${
                  isActive
                    ? 'text-[#148554] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#148554] after:rounded-full'
                    : 'text-gray-600 hover:text-[#148554] font-medium'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">

          {/* Authenticated Only: Portal Feed */}
          {isAuthenticated && (
            <Link
              to="/main"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-600" />
              Portal Feed
            </Link>
          )}

          {/* Auth State Switch */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </span>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <>
              {/* Login Button */}
              <Link
                to="/login"
                className="hidden sm:inline-flex rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>

              {/* Register Button */}
              <Link
                to="/register"
                className="rounded-lg bg-[#047d48] hover:bg-[#03663a] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:shadow-sm"
              >
                Register
              </Link>
            </>
          )}

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

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-semibold text-[#148554]"
          >
            Home
          </Link>
          <Link
            to="/problemlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            Explore Problems
          </Link>
          {(userRole === 'government' || userRole === 'admin') && (
            <Link
              to="/gov/ai-analysis"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
            >
              AI Deep Analysis
            </Link>
          )}
          <Link
            to="/solution-matching"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            Solution & Team Match
          </Link>
          <Link
            to="/gov"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            Government Portal
          </Link>
          <Link
            to="/successstories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[#148554]"
          >
            Success Stories
          </Link>

          <div className="pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {user?.name} ({user?.role})
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Logout
                  </button>
                </div>
                <Link
                  to="/main"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-lg bg-[#047d48] py-2 text-center text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Open Portal Feed
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 rounded-lg border border-gray-300 py-2 text-center text-xs font-semibold text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 rounded-lg bg-[#047d48] py-2 text-center text-xs font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
