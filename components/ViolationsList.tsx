'use client'

import { useMemo, useState } from 'react'

export interface Violation {
  violationId: string
  productTitle: string
  asin: string
  reason: string
  atRiskSales: number
  ahrImpact: string
  status: string
  date: string
  importedAt: string
  actionTaken: string
  nextSteps: string
  options: string
  notes: string
  dateResolved?: string
}

interface Props {
  violations: Violation[]
}

export function ViolationsList({ violations }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState('All Time')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null)
  const [showNeedsAttentionOnly, setShowNeedsAttentionOnly] = useState(false)

  const needsAttentionViolations = useMemo(() => {
    return violations.filter((violation) => violation.notes && violation.notes.trim().length > 0)
  }, [violations])

  const filteredViolations = useMemo(() => {
    const baseViolations = showNeedsAttentionOnly ? needsAttentionViolations : violations
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const now = new Date()

    const daysBack =
      timeFilter === 'Last 7 days'
        ? 7
        : timeFilter === 'Last 30 days'
          ? 30
          : timeFilter === 'Last 90 days'
            ? 90
            : null

    const cutoff = daysBack ? new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000) : null

    return baseViolations.filter((violation) => {
      const matchesStatus =
        statusFilter === 'All Statuses' ? true : violation.status === statusFilter

      const matchesSearch =
        normalizedQuery.length === 0
          ? true
          : [violation.asin, violation.productTitle, violation.reason]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(normalizedQuery))

      let matchesTime = true
      if (cutoff) {
        const parsed = Date.parse(violation.date)
        if (!Number.isNaN(parsed)) {
          matchesTime = new Date(parsed) >= cutoff
        }
      }

      return matchesStatus && matchesSearch && matchesTime
    })
  }, [needsAttentionViolations, searchQuery, showNeedsAttentionOnly, statusFilter, timeFilter, violations])

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ASIN, Product, or Issue Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 min-h-[48px]"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 min-h-[48px]"
          aria-label="Time filter"
        >
          <option>All Time</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 min-h-[48px]"
          aria-label="Status filter"
        >
          <option>All Statuses</option>
          <option>Working</option>
          <option>Waiting on Client</option>
          <option>Submitted</option>
          <option>Denied</option>
          <option>Ignored</option>
          <option>Acknowledged</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Needs Attention */}
      {needsAttentionViolations.length > 0 && (
        <div className="bg-[#1a1f2e] rounded-lg border border-orange-500 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-orange-500 font-semibold">Needs Attention</div>
              <div className="text-gray-300 text-sm">
                {needsAttentionViolations.length} violation{needsAttentionViolations.length === 1 ? '' : 's'} have notes
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNeedsAttentionOnly((prev) => !prev)}
              className="bg-transparent border border-gray-700 hover:border-gray-600 text-white text-sm px-4 rounded-lg transition-colors min-h-[44px]"
            >
              {showNeedsAttentionOnly ? 'Show All' : 'Show Only'}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {needsAttentionViolations.slice(0, 3).map((violation) => (
              <div key={violation.violationId} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium truncate">{violation.productTitle}</div>
                  <div className="text-gray-400 text-xs truncate">{violation.asin}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedViolation(violation)}
                  className="text-orange-500 hover:text-orange-400 text-sm font-medium min-h-[44px]"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="bg-[#1a1f2e] rounded-lg px-6 py-4 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Violation Tracker</h2>
            <p className="text-gray-400 text-sm">{filteredViolations.length} issues found</p>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Cards */}
      <div className="space-y-3 lg:hidden">
        {filteredViolations.map((violation) => (
          <div key={violation.violationId} className="bg-[#1a1f2e] rounded-lg border border-gray-800 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-white font-semibold text-sm truncate">{violation.productTitle}</div>
                <a
                  href={`https://www.amazon.com/dp/${violation.asin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 text-xs"
                  title="View on Amazon"
                >
                  {violation.asin}
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedViolation(violation)}
                className="bg-transparent border border-gray-700 hover:border-gray-600 text-white text-sm px-4 rounded-lg transition-colors min-h-[44px]"
              >
                View
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Issue</div>
                <div className="text-gray-200 text-sm break-words">{violation.reason}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Status</div>
                <div className="text-gray-200 text-sm">{violation.status}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">At Risk</div>
                <div className="text-white text-sm font-medium">${violation.atRiskSales.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">AHR Impact</div>
                <div className="text-gray-200 text-sm">{violation.ahrImpact || '—'}</div>
              </div>
            </div>

            <div className="mt-3 text-gray-400 text-sm">Date: {violation.date || '—'}</div>
          </div>
        ))}
      </div>

      {/* Desktop: Table (no horizontal scroll) */}
      <div className="hidden lg:block bg-[#1a1f2e] rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full table-fixed">
          <thead className="bg-[#151a26]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-[38%]">
                Product
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-[22%]">
                Issue Type
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-[12%]">
                $ At Risk
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-[12%]">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-[10%]">
                Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-[6%]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredViolations.map((violation) => (
              <tr key={violation.violationId} className="hover:bg-[#1e2433] transition-colors">
                <td className="px-6 py-4 align-top">
                  <div className="text-white font-medium text-sm truncate">{violation.productTitle}</div>
                  <a
                    href={`https://www.amazon.com/dp/${violation.asin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 text-xs"
                    title="View on Amazon"
                  >
                    {violation.asin}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm truncate align-top">{violation.reason}</td>
                <td className="px-6 py-4 text-white font-medium text-sm align-top">
                  ${violation.atRiskSales.toLocaleString()}
                </td>
                <td className="px-6 py-4 align-top">
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">
                    {violation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm truncate align-top">{violation.date || '—'}</td>
                <td className="px-6 py-4 align-top">
                  <button
                    type="button"
                    onClick={() => setSelectedViolation(violation)}
                    className="text-orange-500 hover:text-orange-400 text-sm font-medium min-h-[44px]"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredViolations.length === 0 && (
        <div className="bg-[#1a1f2e] rounded-lg p-8 border border-gray-800">
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No issues found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings.</p>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedViolation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-700">
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{selectedViolation.productTitle}</h3>
                <a
                  href={`https://www.amazon.com/dp/${selectedViolation.asin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 text-sm"
                >
                  {selectedViolation.asin}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedViolation(null)}
                className="text-gray-400 hover:text-white text-2xl min-h-[44px] min-w-[44px]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Issue Type</div>
                <div className="text-gray-100 text-sm mt-1">{selectedViolation.reason || '—'}</div>
              </div>
              <div className="bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Status</div>
                <div className="text-gray-100 text-sm mt-1">{selectedViolation.status || '—'}</div>
              </div>
              <div className="bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">At Risk Sales</div>
                <div className="text-white font-medium text-sm mt-1">
                  ${selectedViolation.atRiskSales.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">AHR Impact</div>
                <div className="text-gray-100 text-sm mt-1">{selectedViolation.ahrImpact || '—'}</div>
              </div>
              <div className="bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Date</div>
                <div className="text-gray-100 text-sm mt-1">{selectedViolation.date || '—'}</div>
              </div>
              <div className="bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Imported At</div>
                <div className="text-gray-100 text-sm mt-1">{selectedViolation.importedAt || '—'}</div>
              </div>
              <div className="md:col-span-2 bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Action Taken</div>
                <div className="text-gray-100 text-sm mt-1 whitespace-pre-wrap">{selectedViolation.actionTaken || '—'}</div>
              </div>
              <div className="md:col-span-2 bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Next Steps</div>
                <div className="text-gray-100 text-sm mt-1 whitespace-pre-wrap">{selectedViolation.nextSteps || '—'}</div>
              </div>
              <div className="md:col-span-2 bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Options</div>
                <div className="text-gray-100 text-sm mt-1 whitespace-pre-wrap">{selectedViolation.options || '—'}</div>
              </div>
              <div className="md:col-span-2 bg-gray-700/40 rounded-lg p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Notes</div>
                <div className="text-gray-100 text-sm mt-1 whitespace-pre-wrap">{selectedViolation.notes || '—'}</div>
              </div>
              {selectedViolation.dateResolved && (
                <div className="md:col-span-2 bg-gray-700/40 rounded-lg p-4">
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Date Resolved</div>
                  <div className="text-gray-100 text-sm mt-1">{selectedViolation.dateResolved}</div>
                </div>
              )}
            </div>

            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => setSelectedViolation(null)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
