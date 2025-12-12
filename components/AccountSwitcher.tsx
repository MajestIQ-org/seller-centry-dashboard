'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useTenant } from '@/lib/contexts/TenantContext'

type AccountOption = {
  merchantId: string
  storeName: string
  subdomain: string
}

function computeTargetUrl(subdomain: string) {
  const { protocol, host } = window.location

  // If host is already subdomain.domain.tld, replace the left-most label.
  // For localhost, this may not resolve without local DNS, but it is still the most direct mapping.
  const hostWithoutPort = host.split(':')[0]
  const port = host.includes(':') ? host.split(':')[1] : ''

  if (hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1') {
    const base = port ? `${hostWithoutPort}:${port}` : hostWithoutPort
    return `${protocol}//${subdomain}.${base}/`
  }

  const parts = hostWithoutPort.split('.')
  if (parts.length >= 2) {
    const baseDomain = parts.slice(1).join('.')
    const base = port ? `${baseDomain}:${port}` : baseDomain
    return `${protocol}//${subdomain}.${base}/`
  }

  // Fallback: keep host unchanged
  return `${protocol}//${host}/`
}

export function AccountSwitcher() {
  const { user } = useAuth()
  const { merchantId: currentMerchantId, storeName: currentStoreName } = useTenant()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<AccountOption[]>([])

  useEffect(() => {
    if (!user) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/accounts', { cache: 'no-store' })
        if (!response.ok) throw new Error('Failed to load accounts')
        const payload = (await response.json()) as { accounts?: AccountOption[] }
        const resolved = Array.isArray(payload.accounts) ? payload.accounts : []

        // Keep stable ordering: current first, then alphabetical
        resolved.sort((a, b) => {
          if (currentMerchantId && a.merchantId === currentMerchantId) return -1
          if (currentMerchantId && b.merchantId === currentMerchantId) return 1
          return a.storeName.localeCompare(b.storeName)
        })

        if (!cancelled) setAccounts(resolved)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [currentMerchantId, user])

  if (!user) return null
  if (accounts.length <= 1) return null

  const label = currentStoreName || currentMerchantId || 'Account'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-transparent border border-gray-700 hover:border-gray-600 text-white text-sm px-4 rounded-lg transition-colors min-h-[44px] inline-flex items-center gap-2"
        aria-label="Switch account"
      >
        <span className="max-w-[160px] truncate">{label}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[320px] bg-[#1a1f2e] border border-gray-800 rounded-lg overflow-hidden shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="text-white text-sm font-semibold">Switch account</div>
            <div className="text-gray-400 text-xs">
              {loading ? 'Loading…' : `${accounts.length} available`}
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {accounts.map((acc) => {
              const isCurrent = Boolean(currentMerchantId && acc.merchantId === currentMerchantId)
              return (
                <button
                  key={acc.merchantId}
                  type="button"
                  disabled={isCurrent}
                  onClick={() => {
                    const url = computeTargetUrl(acc.subdomain)
                    window.location.href = url
                  }}
                  className={`w-full text-left px-4 py-3 min-h-[48px] transition-colors ${
                    isCurrent
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:bg-[#1e2433]'
                  }`}
                >
                  <div className="text-white text-sm font-medium truncate">
                    {acc.storeName}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {acc.subdomain} • {acc.merchantId}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="px-4 py-3 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-3 rounded-lg transition-colors min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
