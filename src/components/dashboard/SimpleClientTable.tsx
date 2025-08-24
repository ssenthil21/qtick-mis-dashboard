'use client'

import { Client } from '@/types/domain'

interface SimpleClientTableProps {
  clients: Client[]
  onClientSelect?: (client: Client) => void
}

export function SimpleClientTable({ clients, onClientSelect }: SimpleClientTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Monthly Jobs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onClientSelect?.(client)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {client.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {client.industry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    client.status === 'Paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : client.status === 'Trial'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {client.monthlyJobs}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${client.totalRevenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}