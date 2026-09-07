import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, ArrowUpRight, PlusCircle, Clock, AlertCircle, X } from 'lucide-react'
import { PROBLEMS } from '../data/problemsData'
import ProblemDetailModal from './ProblemDetailModal'

const CATEGORIES = [
  'All Categories',
  'Water Resources',
  'Civic Tech & Disaster',
  'Agriculture & Food',
  'Public Health',
  'Clean Energy & Climate',
  'Education',
]

const STATUSES = ['All Statuses', 'Seeking Partner', 'In Review', 'Matched', 'Building', 'Deployed']

export default function TrendingProblems() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [sortBy, setSortBy] = useState('recent')

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((p) => {
      // Search filter
      const matchesSearch =
        searchTerm.trim() === '' ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))

      // Category filter
      const matchesCategory =
        selectedCategory === 'All Categories' || p.category === selectedCategory

      // Status filter
      const matchesStatus =
        selectedStatus === 'All Statuses' || p.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    }).sort((a, b) => {
      if (sortBy === 'urgency') {
        const order = { Critical: 3, High: 2, Medium: 1 }
        return (order[b.urgency] || 0) - (order[a.urgency] || 0)
      }
      if (sortBy === 'progress') {
        return b.statusStage - a.statusStage
      }
      // default: recent (order in list)
      return 0
    })
  }, [searchTerm, selectedCategory, selectedStatus, sortBy])

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedStatus !== 'All Statuses'

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All Categories')
    setSelectedStatus('All Statuses')
  }

  return (
    <section id="challenges" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
              Live National Ledger · राष्ट्रीय समस्या कोष
            </p>
            <h2 className="mt-2 text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.05] font-extrabold tracking-tight text-ink">
              Open on the public ledger
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-2">
              Every challenge is publicly audited with clear geographic bounds,
              impact geometry, and assigned university research teams.
            </p>
          </div>

          <Link
            to="/get-started"
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-accent-deep hover:shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Put a Problem on Ledger</span>
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-10 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-12">
            {/* Search Input */}
            <div className="relative sm:col-span-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search challenges by keyword, location (e.g. Jhansi, Bihar), or tag..."
                className="w-full rounded-xl border border-line bg-paper py-2.5 pl-10 pr-4 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-4 flex items-center gap-2">
              <label htmlFor="sort" className="text-xs font-medium text-ink-3 whitespace-nowrap hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs text-ink focus:border-accent focus:outline-none"
              >
                <option value="recent">Latest Listings</option>
                <option value="urgency">Urgency / Priority</option>
                <option value="progress">Pipeline Progress</option>
              </select>
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mr-1">
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-accent text-white shadow-xs'
                    : 'border border-line bg-paper text-ink-2 hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mr-1">
                Status:
              </span>
              {STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                    selectedStatus === st
                      ? 'border border-accent bg-accent/15 text-accent font-semibold'
                      : 'border border-line bg-paper/60 text-ink-3 hover:border-accent/40 hover:text-ink'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-deep"
              >
                <X className="h-3 w-3" />
                Reset all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="mt-6 flex items-center justify-between text-xs text-ink-3 px-1">
          <span>
            Showing <strong className="text-ink">{filteredProblems.length}</strong> active challenges
          </span>
          <span className="font-mono text-[11px]">
            {filteredProblems.length === 0 ? 'No matches' : 'Click card to view details'}
          </span>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-line bg-paper-2 p-12 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-ink-3 opacity-60" />
            <h3 className="mt-3 text-base font-semibold text-ink">No challenges found</h3>
            <p className="mt-1 text-xs text-ink-3">
              Try adjusting your search keywords or resetting your filter criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-deep"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProblems.map((p) => (
              <article
                key={p.id}
                onClick={() => setSelectedProblem(p)}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-paper p-5 sm:p-6 transition-all hover:border-accent hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Top Badge Strip */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-accent">
                      {p.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${p.statusTone}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  {/* Location & Time */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-ink-3">
                    <span className="flex items-center gap-1 font-medium text-ink-2">
                      <MapPin className="h-3 w-3 text-accent" />
                      {p.district}, {p.state}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="h-2.5 w-2.5" />
                      {p.when}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-base font-bold leading-snug text-ink group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-2.5 text-xs leading-relaxed text-ink-2 line-clamp-3">
                    {p.summary}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-[10px] text-ink-3"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Stakeholder strip */}
                <div className="mt-6 border-t border-line pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-ink-3">
                        Matched Team
                      </span>
                      <span className="font-semibold text-ink text-xs truncate max-w-[180px]">
                        {p.matchedLab || p.targetLab}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 font-medium text-accent group-hover:translate-x-0.5 transition-transform text-xs">
                      <span>Details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </section>
  )
}