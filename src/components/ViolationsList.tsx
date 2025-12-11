import { useState, useEffect } from 'react'
import type { Violation } from '@/services/violations'
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
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No violations found</p>
        <p className="text-gray-500 text-sm mt-2">All clear!</p>
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
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-400 font-mono">{violation.asin}</span>
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(violation.status)}`}>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                style={{ minHeight: '48px' }}
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">ASIN</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">At Risk</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {violations.map((violation) => (
              <tr key={violation.violationId} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-sm text-gray-300 font-mono">{violation.asin}</td>
                <td className="px-4 py-3 text-sm text-white max-w-md truncate">
                  {violation.productTitle}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{violation.date}</td>
                <td className={`px-4 py-3 text-sm font-bold ${getSalesColor(violation.atRiskSales)}`}>
                  ${violation.atRiskSales.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(violation.status)}`}>
                    {violation.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedViolation(violation)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
