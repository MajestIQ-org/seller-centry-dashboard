import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { fetchViolations, type ViolationsData } from '@/services/violations'
import { SummaryCards } from '@/components/SummaryCards'
import { ViolationsList } from '@/components/ViolationsList'
import { SubmitTicket } from '@/components/SubmitTicket'
import { InviteUser } from '@/components/InviteUser'

export function Dashboard() {
  const { signOut } = useAuth()
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
        .catch(err => setError(err.message))
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
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Account Health Dashboard</h1>
            <p className="text-sm text-gray-400">{tenant?.storeName}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowInviteForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors min-h-[44px]"
            >
              Invite User
            </button>
            <button
              type="button"
              onClick={() => setShowTicketForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors min-h-[44px]"
            >
              Submit Ticket
            </button>
            <button
              type="button"
              onClick={signOut}
              className="text-gray-400 hover:text-white text-sm px-4 min-h-[44px]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors min-h-[48px] ${
              activeTab === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Active Violations
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors min-h-[48px] ${
              activeTab === 'resolved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Resolved
          </button>
        </div>

        <SummaryCards violations={displayViolations} />
        <ViolationsList violations={displayViolations} />
      </main>

      {showTicketForm && <SubmitTicket onClose={() => setShowTicketForm(false)} />}
      {showInviteForm && <InviteUser onClose={() => setShowInviteForm(false)} />}
    </div>
  )
}
