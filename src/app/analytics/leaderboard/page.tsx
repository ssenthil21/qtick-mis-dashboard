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

export default function LeaderboardPage() {
  const managerStats = sampleClients.reduce(
    (acc, client) => {
      const mgr = client.accountManager || 'Unassigned'
      if (!acc[mgr]) {
        acc[mgr] = { clients: 0, totalHealth: 0, revenue: 0 }
      }
      acc[mgr].clients += 1
      acc[mgr].totalHealth += client.healthScore
      acc[mgr].revenue += client.totalRevenue
      return acc
    },
    {} as Record<string, { clients: number; totalHealth: number; revenue: number }>
  )

  const rows = Object.entries(managerStats)
    .map(([name, s]) => ({
      name,
      clients: s.clients,
      avgHealth: s.totalHealth / s.clients,
      revenue: s.revenue
    }))
    .sort((a, b) => b.avgHealth - a.avgHealth)

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Account Manager Leaderboard
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Manager</th>
                  <th className="px-4 py-2 text-left">Clients</th>
                  <th className="px-4 py-2 text-left">Avg Health</th>
                  <th className="px-4 py-2 text-left">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr
                    key={r.name}
                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 font-medium">{r.name}</td>
                    <td className="px-4 py-2">{r.clients}</td>
                    <td className="px-4 py-2">{r.avgHealth.toFixed(1)}%</td>
                    <td className="px-4 py-2">{formatCurrency(r.revenue)}</td>
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
