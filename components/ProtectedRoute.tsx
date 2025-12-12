'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useTenant } from '@/lib/contexts/TenantContext'
import { verifyTenantAccess } from '@/lib/services/tenantAccess'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { sheetId, merchantId, loading: tenantLoading } = useTenant()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
      return
    }

    if (user && merchantId) {
      setHasAccess(null)
      verifyTenantAccess(user.id, merchantId)
        .then(setHasAccess)
        .catch(() => setHasAccess(false))
    }
  }, [authLoading, merchantId, router, user])

  if (authLoading || tenantLoading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    )
  }

  if (!sheetId) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Subdomain</h1>
          <p className="text-gray-400">This subdomain is not configured</p>
        </div>
      </div>
    )
  }

  if (!merchantId) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Client Configuration Error</h1>
          <p className="text-gray-400">Missing merchant ID for this tenant</p>
        </div>
      </div>
    )
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this account</p>
        </div>
      </div>
    )
  }

  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white">Verifying access...</div>
      </div>
    )
  }

  return <>{children}</>
}
