import { useState, useEffect } from 'react'
import type { Violation } from '@src/services/violations'
import { ViolationDetailModal } from './ViolationDetailModal'

interface Props {
  violations: Violation[]
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Working': 'bg-blue-500/20 text-blue-400',
    'Waiting on Client': 'bg-yellow-500/20 text-yellow-400',
    'Submitted': 'bg-purple-500/20 text-purple-400',
    'Denied': 'bg-red-500/20 text-red-400',
    'Ignored': 'bg-gray-500/20 text-gray-400',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

function getSalesColor(amount: number): string {
  if (amount > 1000) return 'text-red-500'
  if (amount > 500) return 'text-yellow-500'
  return 'text-green-500'
}

export function ViolationsList({ violations }: Props) {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (violations.length === 0) {
    return (
      <div className="bg-[#1e2433] rounded-lg p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Violation Tracker</h2>
          <p className="text-gray-500 text-sm">0 issues found</p>
        </div>
        <div className="flex gap-4 mb-6">
          <select aria-label="Time range" title="Time range" className="bg-[#151a24] border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-600">
            <option>All Time</option>
          </select>
          <select aria-label="Status" title="Status" className="bg-[#151a24] border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-600">
            <option>All Statuses</option>
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by ASIN, Product, or Issue Type..."
              className="w-full bg-[#151a24] border border-gray-700 text-gray-300 px-10 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-600"
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 text-xs">⌘ K</span>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No issues found</p>
          <p className="text-gray-600 text-sm mt-2">Try adjusting your search or filter settings.</p>
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {violations.map((violation) => (
            <div
              key={violation.violationId}
              className="bg-[#1e2433] rounded-lg p-4 border-l-4 border-orange-500"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-400 font-mono">{violation.asin}</span>
                <span className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(violation.status)}`}>
                  {violation.status}
                </span>
              </div>

              <h3 className="text-white font-medium mb-2 line-clamp-2">
                {violation.productTitle}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">{violation.date}</span>
                <span className={`text-lg font-bold ${getSalesColor(violation.atRiskSales)}`}>
                  ${violation.atRiskSales.toLocaleString()}
                </span>
              </div>

              {violation.notes && (
                <div className="text-xs text-yellow-500 mb-3">
                  Needs attention
                </div>
              )}

              <button
                onClick={() => setSelectedViolation(violation)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors min-h-[48px]"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {selectedViolation && (
          <ViolationDetailModal
            violation={selectedViolation}
            onClose={() => setSelectedViolation(null)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="bg-[#1e2433] rounded-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Violation Tracker</h2>
            <p className="text-gray-500 text-sm">{violations.length} issues found</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ASIN or Product..."
                className="bg-[#151a24] border border-gray-700 text-gray-300 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-gray-600 w-64"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button type="button" className="flex items-center gap-2 bg-[#151a24] border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              All Statuses
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISSUE TYPE</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ AT RISK</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMPACT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {' '}OPENED
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {violations.map((violation) => (
                <tr key={violation.violationId} className="hover:bg-gray-800/30">
                  <td className="px-4 py-4">
                    <div className="text-sm text-white font-medium max-w-md truncate">{violation.productTitle}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">{violation.asin}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300">{violation.reason}</td>
                  <td className={`px-4 py-4 text-sm font-semibold ${getSalesColor(violation.atRiskSales)}`}>
                    ${violation.atRiskSales.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300">{violation.ahrImpact}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(violation.status)}`}>
                      {violation.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400">{violation.date}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedViolation(violation)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedViolation && (
        <ViolationDetailModal
          violation={selectedViolation}
          onClose={() => setSelectedViolation(null)}
        />
      )}
    </>
  )
}
