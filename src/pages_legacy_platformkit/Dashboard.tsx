import { useState, useEffect } from 'react'
import { useAuth } from '@src/contexts/AuthContext'
import { useTenant } from '@src/contexts/TenantContext'
import { fetchViolations, type ViolationsData } from '@src/services/violations'
import { SummaryCards } from '@src/components/SummaryCards'
import { ViolationsList } from '@src/components/ViolationsList'
import { SubmitTicket } from '@src/components/SubmitTicket'
import { InviteUser } from '@src/components/InviteUser'

export function Dashboard() {
  useAuth()
  const { tenant } = useTenant()
  const [data, setData] = useState<ViolationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'current' | 'resolved'>('current')
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)

  useEffect(() => {
    if (tenant?.sheetId) {
      setLoading(true)
      fetchViolations(tenant.sheetId)
        .then(setData)
        .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
        .finally(() => setLoading(false))
    }
  }, [tenant])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading violations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl font-bold mb-2">Error Loading Data</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    )
  }

  const displayViolations = activeTab === 'current'
    ? data?.currentViolations || []
    : data?.resolvedViolations || []

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <header className="bg-[#1a1f2e] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v6c0 5.25 3.75 9 7 9s7-3.75 7-9V7l-7-5z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg">SELLER<br/>CENTRY</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Synced Just now</span>
              <button type="button" aria-label="Refresh" title="Refresh" className="text-gray-500 hover:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowTicketForm(true)}
              className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Ticket
            </button>
            <button
              type="button"
              onClick={() => setShowInviteForm(true)}
              className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Violations Dashboard</h1>
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-8 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] ${
                activeTab === 'current'
                  ? 'bg-orange-500 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-8 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] ${
                activeTab === 'resolved'
                  ? 'bg-orange-500 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        <SummaryCards violations={displayViolations} />
        <ViolationsList violations={displayViolations} />
      </main>

      {showTicketForm && <SubmitTicket onClose={() => setShowTicketForm(false)} />}
      {showInviteForm && <InviteUser onClose={() => setShowInviteForm(false)} />}
    </div>
  )
}
