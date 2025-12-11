'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface TenantContextType {
  sheetId: string | null
  subdomain: string | null
  loading: boolean
  error: string | null
  retry: () => void
}

interface TenantApiResponse {
  sheetId: string
  subdomain: string
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Omit<TenantContextType, 'retry'>>({
    sheetId: null,
    subdomain: null,
    loading: true,
    error: null,
  })

  const fetchTenant = useCallback(async () => {
    setTenant(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/tenant', {
        cache: 'no-store',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json() as TenantApiResponse
      
      if (!data.sheetId || !data.subdomain) {
        throw new Error('Invalid tenant data received')
      }
      
      setTenant({
        sheetId: data.sheetId,
        subdomain: data.subdomain,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('Failed to fetch tenant:', error)
      setTenant({
        sheetId: null,
        subdomain: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [])

  useEffect(() => {
    fetchTenant()
  }, [fetchTenant])

  const contextValue: TenantContextType = {
    ...tenant,
    retry: fetchTenant,
  }

  return <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
