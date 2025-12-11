import { supabase } from '@src/lib/supabase'

export interface Violation {
  violationId: string
  importedAt: string
  reason: string
  date: string
  asin: string
  productTitle: string
  atRiskSales: number
  actionTaken: string
  ahrImpact: string
  nextSteps: string
  options: string
  status: string
  notes: string
  dateResolved?: string
}

export interface ViolationsData {
  currentViolations: Violation[]
  resolvedViolations: Violation[]
}

export async function fetchViolations(sheetId: string): Promise<ViolationsData> {
  const { data, error } = await supabase.functions.invoke('google-sheets-sync', {
    body: { sheetId }
  })

  if (error) throw new Error(`Failed to fetch violations: ${error.message}`)

  return data
}
