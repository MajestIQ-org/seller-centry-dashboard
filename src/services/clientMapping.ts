import { supabase } from '@src/lib/supabase'

export interface ClientMapping {
  storeName: string
  subdomain: string
  merchantId: string
  sheetId: string
}

export async function getClientBySubdomain(subdomain: string): Promise<ClientMapping | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-client', {
      body: { subdomain }
    })

    if (error || !data) {
      console.error('Error fetching client:', error)
      return null
    }

    return {
      storeName: data.storeName,
      subdomain: data.subdomain,
      merchantId: data.merchantId,
      sheetId: data.sheetId
    }
  } catch (error) {
    console.error('Exception in getClientBySubdomain:', error)
    return null
  }
}
