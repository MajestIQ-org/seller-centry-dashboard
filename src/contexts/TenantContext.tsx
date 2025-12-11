import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useSubdomain } from '@/hooks/useSubdomain'
import { getClientBySubdomain, type ClientMapping } from '@/services/clientMapping'

interface TenantContextType {
  tenant: ClientMapping | null
  loading: boolean
  error: string | null
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const subdomain = useSubdomain()
  const [tenant, setTenant] = useState<ClientMapping | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🌐 TenantContext: subdomain =', subdomain)
    
    if (!subdomain) {
      setLoading(false)
      setError('No subdomain detected')
      return
    }

    getClientBySubdomain(subdomain)
      .then(data => {
        console.log('🏢 Client data received:', data)
        if (data) {
          setTenant(data)
          setError(null)
        } else {
          setError('Client not found')
        }
      })
      .catch(err => {
        console.error('❌ Error fetching client:', err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [subdomain])

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) throw new Error('useTenant must be used within TenantProvider')
  return context
}
