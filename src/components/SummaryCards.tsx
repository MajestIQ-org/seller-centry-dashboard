import type { Violation } from '@/services/violations'

interface Props {
  violations: Violation[]
}

export function SummaryCards({ violations }: Props) {
  const openCount = violations.length
  const totalSales = violations.reduce((sum, v) => sum + v.atRiskSales, 0)
  const highImpact = violations.filter(v => v.ahrImpact === 'High').length
  const needsAttention = violations.filter(v => v.notes && v.notes.trim()).length

  const cards = [
    { label: 'Open Violations', value: openCount, color: 'text-red-500' },
    { label: 'At-Risk Sales', value: `$${totalSales.toLocaleString()}`, color: 'text-yellow-500' },
    { label: 'High Impact', value: highImpact, color: 'text-orange-500' },
    { label: 'Needs Attention', value: needsAttention, color: 'text-blue-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">{card.label}</div>
          <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  )
}
