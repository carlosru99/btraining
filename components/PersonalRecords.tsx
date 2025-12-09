'use client'

import { useMemo } from 'react'

type Log = {
  date: Date
  weight: number
  exercise: {
    name: string
  }
}

export default function PersonalRecords({ logs }: { logs: Log[] }) {
  const records = useMemo(() => {
    const bests: Record<string, { weight: number, date: Date }> = {}
    
    logs.forEach(log => {
      const name = log.exercise.name
      if (!bests[name] || log.weight > bests[name].weight) {
        bests[name] = { weight: log.weight, date: log.date }
      }
    })
    
    return Object.entries(bests)
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, 5) // Top 5 strongest lifts
  }, [logs])

  if (records.length === 0) return null

  return (
    <div className="card backdrop-blur-sm bg-white/80">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Personal Records</h2>
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Top Lifts</span>
      </div>
      
      <div className="space-y-4">
        {records.map(([name, record]) => (
          <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-amber-50/30 transition-colors">
            <div>
              <p className="font-bold text-gray-800">{name}</p>
              <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-amber-600">{record.weight} <span className="text-xs font-medium text-gray-400">kg</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
