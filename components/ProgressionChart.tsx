'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';

type Log = {
  date: Date
  weight: number
  reps: number
  sets: number
  estimated1RM?: number
  exercise: {
    name: string
  }
}

export default function ProgressionChart({ logs }: { logs: Log[] }) {
  // Get unique exercise names from logs
  const exerciseNames = useMemo(() => {
    const names = new Set(logs.map(log => log.exercise.name));
    return Array.from(names);
  }, [logs]);

  const [selectedExercise, setSelectedExercise] = useState<string>(exerciseNames[0] || '');
  const [metric, setMetric] = useState<'weight' | 'volume' | '1rm'>('weight');

  // Filter data based on selection
  const data = useMemo(() => {
    if (!selectedExercise) return [];
    return logs
      .filter(log => log.exercise.name === selectedExercise)
      .map(log => ({
        date: new Date(log.date).toLocaleDateString(),
        weight: log.weight,
        volume: log.weight * log.reps * log.sets,
        '1rm': log.estimated1RM || (log.weight * (1 + log.reps / 30))
      }))
      .reverse();
  }, [logs, selectedExercise]);

  if (logs.length === 0) return null;

  return (
    <div className="card backdrop-blur-sm bg-white/80 h-[450px] w-full mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-gray-900">Visión General del Progreso</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setMetric('weight')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                metric === 'weight' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Peso
            </button>
            <button
              onClick={() => setMetric('volume')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                metric === 'volume' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Volumen
            </button>
            <button
              onClick={() => setMetric('1rm')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                metric === '1rm' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              1RM
            </button>
          </div>
          <select 
            value={selectedExercise} 
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="select-field py-2 px-4 text-sm w-full sm:w-auto bg-white/50 cursor-pointer hover:bg-white transition-colors"
          >
            {exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{fill: '#9ca3af', fontSize: 12}} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              tick={{fill: '#9ca3af', fontSize: 12}} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              name={metric === 'weight' ? 'Peso (kg)' : metric === 'volume' ? 'Volumen (kg)' : '1RM Estimado (kg)'}
              type="monotone" 
              dataKey={metric} 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, fill: '#f97316', strokeWidth: 0 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Selecciona un ejercicio para ver su progreso
        </div>
      )}
    </div>
  );
}
