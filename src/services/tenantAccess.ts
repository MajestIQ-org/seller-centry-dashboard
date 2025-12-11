import { supabase } from '@src/lib/supabase'

export async function verifyTenantAccess(
  userId: string,
  merchantId: string
): Promise<boolean> {
  console.log('🔍 verifyTenantAccess called:', { userId, merchantId })
  
  const { data, error } = await supabase
    .from('user_tenants')
    .select('*')
    .eq('user_id', userId)
    .eq('merchant_id', merchantId)
    .single()

  console.log('📊 Query result:', { data, error })
  
  const hasAccess = !error && !!data
  console.log('✅ Has access:', hasAccess)
  
  return hasAccess
}

export async function getUserTenants(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_tenants')
    .select('merchant_id')
    .eq('user_id', userId)

  if (error || !data) return []

  return data.map(row => row.merchant_id)
}
