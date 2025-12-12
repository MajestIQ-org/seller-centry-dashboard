import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { google } from 'npm:googleapis@118'

const serviceAccount = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || '{}')
// Default matches the mapping sheet referenced in ТЗ.
const MAPPING_SHEET_ID =
  Deno.env.get('CLIENT_MAPPING_SHEET_ID') ?? '1p-J1x9B6UlaUNkULjx8YMXRpqKVaD1vRnkOjYTD1qMc'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subdomain, merchantId } = await req.json()

    if (!subdomain && !merchantId) {
      return new Response(
        JSON.stringify({ error: 'subdomain or merchantId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!serviceAccount || !serviceAccount.client_email) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Google service account not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: MAPPING_SHEET_ID,
      range: 'All Seller Information!A2:D',
    })

    const rows = response.data.values || []

    const normalizedSubdomain = typeof subdomain === 'string' ? subdomain.toLowerCase() : ''
    const normalizedMerchantId = typeof merchantId === 'string' ? merchantId.trim() : ''

    const clientRow = rows.find((row: string[]) => {
      const rowStoreName = String(row[0] || '')
      const rowMerchantId = String(row[1] || '')
      const rowSlug = rowStoreName.toLowerCase().replace(/\s+/g, '-')

      if (normalizedMerchantId) return rowMerchantId === normalizedMerchantId
      return rowSlug === normalizedSubdomain
    })

    if (!clientRow) {
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const [storeName, merchantId, _email, sheetUrl] = clientRow
    const normalizedStoreName = String(storeName || '')
    const resolvedSubdomain = normalizedStoreName.toLowerCase().replace(/\s+/g, '-')

    const sheetIdMatch = sheetUrl?.match(/\/d\/([a-zA-Z0-9-_]+)/)
    const sheetId = sheetIdMatch ? sheetIdMatch[1] : null

    if (!sheetId) {
      return new Response(
        JSON.stringify({ error: 'Invalid sheet URL in mapping' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        storeName: normalizedStoreName,
        subdomain: resolvedSubdomain,
        merchantId: merchantId || '',
        sheetId: sheetId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode =
      typeof error === 'object' && error && 'code' in error
        ? (error as { code?: unknown }).code
        : undefined
    
    if (errorCode === 404) {
      return new Response(
        JSON.stringify({ error: 'Client mapping sheet not found or not accessible' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (errorCode === 403) {
      return new Response(
        JSON.stringify({ error: 'Permission denied. Please share the mapping sheet with: ' + serviceAccount.client_email }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
