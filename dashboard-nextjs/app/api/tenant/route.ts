import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface ClientMapping {
  sheetId: string
  subdomain: string
}

export async function GET() {
  try {
    const headersList = await headers()
    const subdomain = headersList.get('x-tenant-subdomain')

    if (!subdomain) {
      return NextResponse.json(
        { error: 'No subdomain found' },
        { status: 400 }
      )
    }

    // For local development, return mock data
    const hostname = headersList.get('host') || ''
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      console.log('Using mock data for localhost, subdomain:', subdomain)
      return NextResponse.json({
        sheetId: 'https://docs.google.com/spreadsheets/d/1fJ5Qs_VwEr8oN3mP2xL9YzK4Aw6Bg8CjT7DuE1VsH2Ii/edit',
        subdomain: subdomain,
        storeName: subdomain
      })
    }

    // Check environment variables - need SERVICE_ROLE_KEY for edge functions
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('Fetching client for subdomain:', subdomain)

    // Call Supabase Edge Function to get client mapping
    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-client`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ subdomain }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('get-client error:', response.status, errorText)
      return NextResponse.json(
        { error: `Client not found for subdomain: ${subdomain}` },
        { status: 404 }
      )
    }

    const data = await response.json() as { sheetId: string }

    if (!data.sheetId) {
      return NextResponse.json(
        { error: 'Invalid client configuration' },
        { status: 500 }
      )
    }

    const result: ClientMapping = {
      sheetId: data.sheetId,
      subdomain: subdomain,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tenant data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
