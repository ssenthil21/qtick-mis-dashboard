'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { sampleClients } from '@/lib/seed'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export default function IndustryPerformancePage() {
  const industries = Array.from(new Set(sampleClients.map(c => c.industry)))

  const stats = industries.map(ind => {
    const clients = sampleClients.filter(c => c.industry === ind)
    const avgMRR =
      clients.reduce((sum, c) => sum + c.totalRevenue / 12, 0) / clients.length
    const avgHealth =
      clients.reduce((sum, c) => sum + c.healthScore, 0) / clients.length
    const churnRate = 100 - avgHealth

    // determine most used feature
    const featureUsage: Record<string, number> = {}
    clients.forEach(c =>
      c.features.forEach(f => {
        featureUsage[f.featureName] = (featureUsage[f.featureName] || 0) + f.usageCount
      })
    )
    const topFeature = Object.entries(featureUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return { industry: ind, avgMRR, churnRate, topFeature }
  })

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Industry Performance
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Industry</th>
                  <th className="px-4 py-2 text-left">Avg MRR</th>
                  <th className="px-4 py-2 text-left">Avg Churn Rate</th>
                  <th className="px-4 py-2 text-left">Top Feature</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(s => (
                  <tr
                    key={s.industry}
                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                  >
                    <td className="px-4 py-2 font-medium">{s.industry}</td>
                    <td className="px-4 py-2">{formatCurrency(s.avgMRR)}</td>
                    <td className="px-4 py-2">{s.churnRate.toFixed(1)}%</td>
                    <td className="px-4 py-2">{s.topFeature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
