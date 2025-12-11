'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface TenantContextType {
  sheetId: string | null
  subdomain: string | null
  loading: boolean
  error: string | null
}

const TenantContext = createContext<TenantContextType>({
  sheetId: null,
  subdomain: null,
  loading: true,
  error: null,
})

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantContextType>({
    sheetId: null,
    subdomain: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchTenant() {
      try {
        const response = await fetch('/api/tenant')
        if (!response.ok) {
          throw new Error('Failed to fetch tenant data')
        }
        const data = await response.json()
        setTenant({
          sheetId: data.sheetId,
          subdomain: data.subdomain,
          loading: false,
          error: null,
        })
      } catch (error) {
        setTenant({
          sheetId: null,
          subdomain: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    fetchTenant()
  }, [])

  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
