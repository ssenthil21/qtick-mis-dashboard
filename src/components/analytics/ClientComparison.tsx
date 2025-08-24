'use client'

import { useState } from 'react'
import { sampleClients } from '@/lib/seed'
import { RadarChart, ChartErrorBoundary } from '@/components/charts'

/**
 * ClientComparison renders a simple side-by-side comparison for two clients
 * including a radar chart visualisation.
 */
export function ClientComparison() {
  const [clientAId, setClientAId] = useState(sampleClients[0]?.id)
  const [clientBId, setClientBId] = useState(sampleClients[1]?.id)

  const clientA = sampleClients.find(c => c.id === clientAId)
  const clientB = sampleClients.find(c => c.id === clientBId)

  if (!clientA || !clientB) return null

  const metrics = [
    { label: 'Revenue', a: clientA.totalRevenue, b: clientB.totalRevenue, format: (v:number) => v.toLocaleString() },
    { label: 'Monthly Jobs', a: clientA.monthlyJobs, b: clientB.monthlyJobs, format: (v:number) => v.toString() },
    { label: 'Health Score', a: clientA.healthScore, b: clientB.healthScore, format: (v:number) => `${v}%` },
    { label: 'Avg Review', a: clientA.averageReview, b: clientB.averageReview, format: (v:number) => v.toFixed(1) }
  ]

  const chartData = {
    labels: metrics.map(m => m.label),
    datasets: [
      { label: clientA.name, data: [clientA.totalRevenue, clientA.monthlyJobs, clientA.healthScore, clientA.averageReview * 20] },
      { label: clientB.name, data: [clientB.totalRevenue, clientB.monthlyJobs, clientB.healthScore, clientB.averageReview * 20] }
    ]
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Client Comparison</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={clientAId}
          onChange={e => setClientAId(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          {sampleClients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={clientBId}
          onChange={e => setClientBId(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          {sampleClients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">Metric</th>
              <th className="px-4 py-2 text-left">{clientA.name}</th>
              <th className="px-4 py-2 text-left">{clientB.name}</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => (
              <tr key={m.label} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                <td className="px-4 py-2 font-medium">{m.label}</td>
                <td className="px-4 py-2">{m.format(m.a)}</td>
                <td className="px-4 py-2">{m.format(m.b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <ChartErrorBoundary>
          <RadarChart data={chartData} className="h-80" />
        </ChartErrorBoundary>
      </div>
    </div>
  )
}

export default ClientComparison
