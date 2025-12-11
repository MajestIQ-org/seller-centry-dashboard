import { type Violation } from './ViolationsList'

interface Props {
  violations: Violation[]
}

export function SummaryCards({ violations }: Props) {
  const openCount = violations.length
  const totalSales = violations.reduce((sum, v) => sum + v.atRiskSales, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-[#1e2433] rounded-lg p-6 border-l-4 border-orange-500 relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-gray-400 text-sm uppercase tracking-wide mb-2">OPEN VIOLATIONS</div>
            <div className="text-5xl font-bold text-white mb-2">{openCount}</div>
            <div className="text-gray-500 text-sm">Active cases requiring attention</div>
          </div>
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#1e2433] rounded-lg p-6 border-l-4 border-orange-500 relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-gray-400 text-sm uppercase tracking-wide mb-2">AT-RISK SALES</div>
            <div className="text-5xl font-bold text-white mb-2">${totalSales.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Potential revenue impact</div>
          </div>
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
