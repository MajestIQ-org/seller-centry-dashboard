import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { verifyTenantAccess } from '@/services/tenantAccess'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const { tenant, loading: tenantLoading } = useTenant()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    console.log('🔐 ProtectedRoute: checking access', { 
      user: user?.id, 
      tenant: tenant?.merchantId 
    })
    
    if (user && tenant) {
      console.log('🔑 Verifying access for:', { userId: user.id, merchantId: tenant.merchantId })
      verifyTenantAccess(user.id, tenant.merchantId).then(access => {
        console.log('🎯 Access result:', access)
        setHasAccess(access)
      })
    }
  }, [user, tenant])

  if (authLoading || tenantLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Subdomain</h1>
          <p className="text-gray-400">This subdomain is not configured</p>
        </div>
      </div>
    )
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this account</p>
        </div>
      </div>
    )
  }

  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Verifying access...</div>
      </div>
    )
  }

  return <>{children}</>
}
