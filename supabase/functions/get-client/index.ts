import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { google } from 'npm:googleapis@118'

const serviceAccount = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || '{}')
const MAPPING_SHEET_ID = '1p-J1x9B6UlaUNkULjx8YMXRpqKVaD1vRnkOjYTD1qMc'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subdomain } = await req.json()

    if (!subdomain) {
      return new Response(
        JSON.stringify({ error: 'Subdomain is required' }),
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
    
    const clientRow = rows.find((row: string[]) => 
      row[0]?.toLowerCase().replace(/\s+/g, '-') === subdomain.toLowerCase()
    )

    if (!clientRow) {
      return new Response(
        JSON.stringify({ error: 'Client not found for subdomain: ' + subdomain }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const [storeName, merchantId, email, sheetUrl] = clientRow

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
        storeName: storeName || '',
        merchantId: merchantId || '',
        email: email || '',
        sheetUrl: sheetUrl || '',
        sheetId: sheetId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (error.code === 404) {
      return new Response(
        JSON.stringify({ error: 'Client mapping sheet not found or not accessible' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (error.code === 403) {
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
