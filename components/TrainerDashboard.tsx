'use client'

import { useState } from 'react'
import { createClient } from '@/app/actions'
import Link from 'next/link'

export default function TrainerDashboard({ user, clients }: { user: any, clients: any[] }) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-8 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>
      <div className="absolute top-20 left-0 -translate-x-12 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight heading-gradient">Panel de Entrenador</h1>
          <p className="text-gray-500 mt-1 text-lg">Bienvenido, <span className="font-semibold text-gray-700">{user.name}</span></p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary py-2.5 px-6 text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Cliente
        </button>
      </div>

      {isCreating && (
        <div className="card backdrop-blur-sm bg-white/80 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Registrar Nuevo Cliente</h2>
          <form action={async (formData) => {
            await createClient(formData)
            setIsCreating(false)
          }} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Ej. Cliente Nuevo"
                className="input-field w-full"
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap h-[42px]">
              Crear Cliente
            </button>
          </form>
        </div>
      )}

      <div className="card backdrop-blur-sm bg-white/80">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Mis Clientes</h2>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{clients.length} Total</span>
        </div>
        
        {clients.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="font-medium">Aún no tienes clientes asignados.</p>
            <p className="text-sm mt-2">¡Empieza registrando tu primer cliente!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <Link 
                key={client.id} 
                href={`/dashboard/client/${client.id}`}
                className="group block p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg group-hover:scale-110 transition-transform">
                    {client.name?.[0] || 'C'}
                  </div>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {client._count.logs} registros
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{client.name}</h3>
                {client.trainer && (
                   <p className="text-xs text-gray-500 mt-0.5 font-medium">Entrenador: <span className="text-gray-700">{client.trainer.name}</span></p>
                )}
                <p className="text-sm text-gray-500 mt-1">Cliente desde {new Date(client.createdAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
