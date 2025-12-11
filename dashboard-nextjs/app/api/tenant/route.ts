import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
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
      console.error('get-client error:', errorText)
      throw new Error('Failed to fetch client mapping')
    }

    const data = await response.json()

    return NextResponse.json({
      sheetId: data.sheetId,
      subdomain: subdomain,
    })
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tenant data' },
      { status: 500 }
    )
  }
}
