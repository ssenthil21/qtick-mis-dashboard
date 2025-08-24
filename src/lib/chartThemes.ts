// Chart theme configuration and color palettes

export interface ChartTheme {
  background: string
  text: {
    primary: string
    secondary: string
    muted: string
  }
  grid: {
    color: string
    borderColor: string
  }
  tooltip: {
    background: string
    border: string
    text: string
  }
  colors: {
    primary: string[]
    secondary: string[]
    accent: string[]
  }
}

export const lightTheme: ChartTheme = {
  background: '#ffffff',
  text: {
    primary: '#111827',
    secondary: '#374151',
    muted: '#6b7280'
  },
  grid: {
    color: '#e5e7eb',
    borderColor: '#d1d5db'
  },
  tooltip: {
    background: '#ffffff',
    border: '#d1d5db',
    text: '#374151'
  },
  colors: {
    primary: [
      '#2563eb', // blue-600
      '#059669', // emerald-600
      '#d97706', // amber-600
      '#dc2626', // red-600
      '#7c3aed', // violet-600
      '#0891b2', // cyan-600
      '#65a30d', // lime-600
      '#ea580c'  // orange-600
    ],
    secondary: [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#06b6d4', // cyan-500
      '#84cc16', // lime-500
      '#f97316'  // orange-500
    ],
    accent: [
      '#1d4ed8', // blue-700
      '#047857', // emerald-700
      '#b45309', // amber-700
      '#b91c1c', // red-700
      '#6d28d9', // violet-700
      '#0e7490', // cyan-700
      '#4d7c0f', // lime-700
      '#c2410c'  // orange-700
    ]
  }
}

export const darkTheme: ChartTheme = {
  background: '#1f2937',
  text: {
    primary: '#f9fafb',
    secondary: '#e5e7eb',
    muted: '#d1d5db'
  },
  grid: {
    color: '#374151',
    borderColor: '#4b5563'
  },
  tooltip: {
    background: '#374151',
    border: '#6b7280',
    text: '#e5e7eb'
  },
  colors: {
    primary: [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#06b6d4', // cyan-500
      '#84cc16', // lime-500
      '#f97316'  // orange-500
    ],
    secondary: [
      '#60a5fa', // blue-400
      '#34d399', // emerald-400
      '#fbbf24', // amber-400
      '#f87171', // red-400
      '#a78bfa', // violet-400
      '#22d3ee', // cyan-400
      '#a3e635', // lime-400
      '#fb923c'  // orange-400
    ],
    accent: [
      '#1e40af', // blue-800
      '#065f46', // emerald-800
      '#92400e', // amber-800
      '#991b1b', // red-800
      '#5b21b6', // violet-800
      '#155e75', // cyan-800
      '#365314', // lime-800
      '#9a3412'  // orange-800
    ]
  }
}

export function getChartTheme(isDark: boolean): ChartTheme {
  return isDark ? darkTheme : lightTheme
}

// Utility function to create theme-aware chart options
export function createChartOptions(isDark: boolean, title?: string) {
  const theme = getChartTheme(isDark)
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.text.secondary,
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: !!title,
        text: title,
        color: theme.text.primary,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: theme.tooltip.background,
        titleColor: theme.text.primary,
        bodyColor: theme.tooltip.text,
        borderColor: theme.tooltip.border,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        animation: {
          duration: 200
        }
      }
    }
  }
}

// Utility function to apply theme colors to datasets
export function applyThemeToDatasets(datasets: any[], isDark: boolean, colorType: 'primary' | 'secondary' | 'accent' = 'primary') {
  const theme = getChartTheme(isDark)
  const colors = theme.colors[colorType]
  
  return datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || colors[index % colors.length],
    borderColor: dataset.borderColor || colors[index % colors.length],
    borderWidth: dataset.borderWidth || 2
  }))
}

// Utility function for pie/doughnut charts with transparency
export function applyThemeToArcDatasets(datasets: any[], isDark: boolean, opacity: number = 0.8) {
  const theme = getChartTheme(isDark)
  const colors = theme.colors.primary
  
  return datasets.map(dataset => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || colors.map(color => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`),
    borderColor: dataset.borderColor || (isDark ? '#374151' : '#ffffff'),
    borderWidth: dataset.borderWidth || 2
  }))
}