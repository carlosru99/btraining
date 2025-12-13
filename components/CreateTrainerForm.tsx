'use client'

import { useState } from 'react'
import { createTrainer } from '@/app/actions'

export default function CreateTrainerForm() {
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await createTrainer(formData)
    if (result.error) {
      setError(result.error)
      setInviteLink(null)
    } else if (result.token) {
      const link = `${window.location.origin}/register?token=${result.token}`
      setInviteLink(link)
      setError(null)
    }
  }

  return (
    <div className="card backdrop-blur-sm bg-white/80 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Entrenador</h2>
      <p className="text-sm text-gray-500 mb-4">Crea un perfil para un entrenador y genera un enlace para que complete su registro.</p>
      <form action={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Entrenador</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Ej. Entrenador Pro"
            className="input-field w-full"
          />
        </div>
        <button type="submit" className="btn-primary whitespace-nowrap py-5 mb-1">
          Generar Invitación
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {inviteLink && (
        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl">
          <p className="text-sm text-green-800 font-medium mb-2">¡Entrenador creado! Comparte este enlace para que complete su registro:</p>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={inviteLink} 
              className="flex-1 bg-white border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2 outline-none"
              onClick={(e) => e.currentTarget.select()}
            />
            <button 
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Copiar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
