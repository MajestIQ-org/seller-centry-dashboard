'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function verifyTenantAccess(userId: string, merchantId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_tenants')
    .select('*')
    .eq('user_id', userId)
    .eq('merchant_id', merchantId)
    .single()

  return !error && !!data
}
