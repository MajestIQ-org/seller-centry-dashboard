import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { google } from 'npm:googleapis@118'

const serviceAccount = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || '{}')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sheetId } = await req.json()

    if (!sheetId) {
      return new Response(
        JSON.stringify({ error: 'Sheet ID is required' }),
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

    let currentData, resolvedData

    try {
      [currentData, resolvedData] = await Promise.all([
        sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: 'All Current Violations!A2:M',
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: 'All Resolved Violations!A2:N',
        }),
      ])
    } catch (sheetsError: any) {
      if (sheetsError.code === 404) {
        return new Response(
          JSON.stringify({ error: 'Spreadsheet not found or not accessible. Please ensure the sheet is shared with the service account.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (sheetsError.code === 403) {
        return new Response(
          JSON.stringify({ error: 'Permission denied. Please share the spreadsheet with: ' + serviceAccount.client_email }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      throw sheetsError
    }

    const parseViolation = (row: string[], includeResolved = false) => ({
      violationId: row[0] || '',
      importedAt: row[1] || '',
      reason: row[2] || '',
      date: row[3] || '',
      asin: row[4] || '',
      productTitle: row[5] || '',
      atRiskSales: parseFloat(row[6]) || 0,
      actionTaken: row[7] || '',
      ahrImpact: row[8] || '',
      nextSteps: row[9] || '',
      options: row[10] || '',
      status: row[11] || '',
      notes: row[12] || '',
      ...(includeResolved && { dateResolved: row[13] || '' })
    })

    return new Response(
      JSON.stringify({
        currentViolations: (currentData.data.values || []).map((row: string[]) => parseViolation(row)),
        resolvedViolations: (resolvedData.data.values || []).map((row: string[]) => parseViolation(row, true)),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
