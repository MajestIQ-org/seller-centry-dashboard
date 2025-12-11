import type { Violation } from '@src/services/violations'

interface Props {
  violation: Violation
  onClose: () => void
}

export function ViolationDetailModal({ violation, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Violation Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none flex items-center justify-center"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm text-gray-400">Violation ID</label>
            <div className="text-white font-mono">{violation.violationId}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">ASIN</label>
              <div className="text-white font-mono">{violation.asin}</div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <div className="text-white">{violation.status}</div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Product Title</label>
            <div className="text-white">{violation.productTitle}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">At Risk Sales</label>
              <div className="text-2xl font-bold text-red-500">
                ${violation.atRiskSales.toLocaleString()}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">AHR Impact</label>
              <div className="text-white">{violation.ahrImpact}</div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Reason</label>
            <div className="text-white">{violation.reason}</div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Action Taken</label>
            <div className="text-white">{violation.actionTaken}</div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Next Steps</label>
            <div className="text-white">{violation.nextSteps}</div>
          </div>

          {violation.options && (
            <div>
              <label className="text-sm text-gray-400">Options</label>
              <div className="text-white">{violation.options}</div>
            </div>
          )}

          {violation.notes && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
              <label className="text-sm text-yellow-500 font-medium">Notes</label>
              <div className="text-yellow-200 mt-1">{violation.notes}</div>
            </div>
          )}

          {violation.dateResolved && (
            <div>
              <label className="text-sm text-gray-400">Date Resolved</label>
              <div className="text-white">{violation.dateResolved}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
