'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTenant } from '@/lib/contexts/TenantContext'
import { useAuth } from '@/lib/contexts/AuthContext'

interface Props {
  onClose: () => void
}

export function InviteUser({ onClose }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const { merchantId } = useTenant()
  const { user } = useAuth()

  const [email, setEmail] = useState('')
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [availableMerchantIds, setAvailableMerchantIds] = useState<string[]>([])
  const [selectedMerchantIds, setSelectedMerchantIds] = useState<string[]>(merchantId ? [merchantId] : [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [inviteUrl, setInviteUrl] = useState('')

  useEffect(() => {
    if (!user) return

    supabase
      .from('user_tenants')
      .select('merchant_id')
      .eq('user_id', user.id)
      .then(({ data, error: fetchError }) => {
        if (fetchError) return
        const ids = (data || []).map((r) => String(r.merchant_id)).filter(Boolean)
        setAvailableMerchantIds(ids)
        setSelectedMerchantIds((prev) => {
          const next = new Set(prev.length > 0 ? prev : (merchantId ? [merchantId] : []))
          if (merchantId) next.add(merchantId)
          return Array.from(next)
        })
      })
  }, [merchantId, supabase, user])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (selectedMerchantIds.length === 0) {
      setError('Please select at least one account')
      setLoading(false)
      return
    }

    try {
      const { data, error: inviteError } = await supabase.functions.invoke('create-invite', {
        body: {
          email,
          merchantIds: selectedMerchantIds,
          expiresInDays,
        },
      })

      if (inviteError) throw inviteError
      if (data?.error) throw new Error(data.error)

      setSuccess(true)
      setInviteUrl(data.inviteUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invite')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl)
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-white mb-2">Invitation Sent</h3>
            <p className="text-gray-400">An email has been sent to {email}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Invite Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteUrl}
                readOnly
                aria-label="Invite link"
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors min-h-[44px]"
              >
                Copy
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Invite User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl min-h-[44px] min-w-[44px]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label htmlFor="expires" className="block text-sm font-medium text-gray-300 mb-2">
              Expires In (Days)
            </label>
            <select
              id="expires"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>

          {availableMerchantIds.length > 1 && (
            <div>
              <div className="block text-sm font-medium text-gray-300 mb-2">Accounts</div>
              <div className="space-y-2">
                {availableMerchantIds.map((id) => {
                  const checked = selectedMerchantIds.includes(id)
                  return (
                    <label key={id} className="flex items-center justify-between gap-3 bg-gray-700/40 border border-gray-600 rounded-lg px-4 py-3 min-h-[48px]">
                      <span className="text-white text-sm break-all">{id}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedMerchantIds((prev) =>
                            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                          )
                        }}
                        className="h-5 w-5"
                        aria-label={`Select account ${id}`}
                      />
                    </label>
                  )
                })}
              </div>
              <p className="text-gray-400 text-xs mt-2">
                The invited user will get access to all selected accounts.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
