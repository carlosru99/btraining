'use client'

import { useState } from "react"
import LogExerciseForm from "@/components/LogExerciseForm"
import ProgressionChart from "@/components/ProgressionChart"
import PersonalRecords from "@/components/PersonalRecords"

type DashboardClientProps = {
  user: any
  exercises: any[]
  logs: any[]
  isAdminView?: boolean
}

export default function DashboardClient({ user, exercises, logs, isAdminView = false }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-8 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>
      <div className="absolute top-20 left-0 -translate-x-12 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight heading-gradient">
            {isAdminView ? `${user.name || user.email}` : 'Dashboard'}
          </h1>
          {!isAdminView && (
            <p className="text-gray-500 mt-1 text-lg">Welcome back, <span className="font-semibold text-gray-700">{user.name || user.email}</span></p>
          )}
          {isAdminView && (
             <p className="text-gray-500 mt-1 text-lg">Viewing user data and progress</p>
          )}
        </div>
        <div className="flex items-center gap-4">
            <div className="glass-panel px-5 py-2.5 rounded-2xl text-sm font-medium text-gray-600 shadow-sm hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {!isAdminView && (
              <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary py-2.5 px-6 text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Log Workout
              </button>
            )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProgressionChart logs={logs} />

          <div className="card backdrop-blur-sm bg-white/80">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Last 100 Logs</span>
              </div>
              
              {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <p className="font-medium">No workouts logged yet.</p>
                      <p className="text-sm mt-2">Start by logging your first set!</p>
                  </div>
              ) : (
                  <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                          <thead>
                              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-xs">
                                  <th className="pb-4 font-semibold pl-4">Date</th>
                                  <th className="pb-4 font-semibold">Exercise</th>
                                  <th className="pb-4 font-semibold">Weight</th>
                                  <th className="pb-4 font-semibold">Reps</th>
                                  <th className="pb-4 font-semibold">Sets</th>
                                  <th className="pb-4 font-semibold">Est. 1RM</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                              {logs.slice(0, 10).map((log: any) => (
                                  <tr key={log.id} className="hover:bg-orange-50/30 transition-colors group">
                                      <td className="py-4 pl-4 text-gray-500 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                                      <td className="py-4 font-bold text-gray-800 group-hover:text-orange-700 transition-colors">{log.exercise.name}</td>
                                      <td className="py-4 text-gray-600 font-medium">{log.weight} <span className="text-xs text-gray-400 font-normal">kg</span></td>
                                      <td className="py-4 text-gray-600 font-medium">{log.reps}</td>
                                      <td className="py-4 text-gray-600 font-medium">{log.sets}</td>
                                      <td className="py-4 text-gray-600 font-medium">
                                        {log.estimated1RM ? (
                                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold">
                                            {Math.round(log.estimated1RM)} kg
                                          </span>
                                        ) : (
                                          <span className="text-gray-300">-</span>
                                        )}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <PersonalRecords logs={logs} />
          
          {/* Quick Stats Card */}
          <div className="card backdrop-blur-sm bg-white/80">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Total Workouts</p>
                <p className="text-3xl font-black text-gray-900">{logs.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Exercises</p>
                <p className="text-3xl font-black text-gray-900">{exercises.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute -top-12 right-0 text-white hover:text-gray-200 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <LogExerciseForm 
                    exercises={exercises} 
                    onSuccess={() => setIsModalOpen(false)} 
                />
            </div>
        </div>
      )}
    </div>
  )
}
