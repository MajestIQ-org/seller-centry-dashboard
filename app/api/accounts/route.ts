import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type AccountOption = {
  merchantId: string
  storeName: string
  subdomain: string
}

function toSubdomainFallback(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}

async function resolveAccountFromMerchantId(merchantId: string): Promise<AccountOption> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      merchantId,
      storeName: merchantId,
      subdomain: toSubdomainFallback(merchantId),
    }
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/get-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ merchantId }),
    })

    if (!response.ok) throw new Error('get-client failed')

    const data = (await response.json()) as {
      storeName?: string
      subdomain?: string
      merchantId?: string
    }

    const storeName = String(data.storeName || '').trim() || merchantId
    const subdomain = String(data.subdomain || '').trim() || toSubdomainFallback(storeName)

    return { merchantId, storeName, subdomain }
  } catch {
    return {
      merchantId,
      storeName: merchantId,
      subdomain: toSubdomainFallback(merchantId),
    }
  }
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_tenants')
    .select('merchant_id')
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to load accounts' }, { status: 500 })
  }

  const merchantIds = Array.from(
    new Set((data || []).map((r) => String(r.merchant_id)).filter(Boolean))
  )

  const accounts = await Promise.all(merchantIds.map((id) => resolveAccountFromMerchantId(id)))
  accounts.sort((a, b) => a.storeName.localeCompare(b.storeName))

  return NextResponse.json({ accounts })
}