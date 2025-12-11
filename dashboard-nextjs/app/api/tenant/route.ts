import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface ClientMapping {
  sheetId: string
  subdomain: string
}

export async function GET() {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const headersList = await headers()
    const subdomain = headersList.get('x-tenant-subdomain')

    if (!subdomain) {
      return NextResponse.json(
        { error: 'No subdomain found' },
        { status: 400 }
      )
    }

    // Call Supabase Edge Function to get client mapping
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-client`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
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
