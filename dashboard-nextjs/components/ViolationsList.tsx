'use client'

interface Violation {
  id: string
  product: string
  asin: string
  issueType: string
  atRiskSales: number
  impact: string
  status: string
  opened: string
  [key: string]: any
}

interface Props {
  violations: Violation[]
}

export function ViolationsList({ violations }: Props) {
  if (violations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No violations found
      </div>
    )
  }

  return (
    <div className="bg-[#1a1f2e] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#151a26] border-b border-gray-800">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Issue Type</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">$ At Risk</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Impact</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Opened</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {violations.map((violation) => (
              <tr key={violation.id} className="hover:bg-[#1e2433] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-medium">{violation.product}</div>
                  <div className="text-gray-400 text-sm">{violation.asin}</div>
                </td>
                <td className="px-6 py-4 text-gray-300">{violation.issueType}</td>
                <td className="px-6 py-4 text-white font-medium">${violation.atRiskSales.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    violation.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                    violation.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {violation.impact}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                    {violation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{violation.opened}</td>
                <td className="px-6 py-4">
                  <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
