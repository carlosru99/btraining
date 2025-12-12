'use client'

import { createExercise } from "@/app/actions"
import { useRef, useState } from "react"

export default function AddExerciseForm() {
  const ref = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form
      action={async (formData) => {
        setIsSubmitting(true)
        setMessage(null)
        try {
          const result = await createExercise(formData)
          if (result?.error) {
            setMessage({ type: 'error', text: result.error })
          } else {
            ref.current?.reset()
            setMessage({ type: 'success', text: "¡Ejercicio añadido correctamente!" })
            setTimeout(() => setMessage(null), 3000)
          }
        } catch (e) {
          setMessage({ type: 'error', text: "Algo salió mal. Por favor inténtalo de nuevo." })
        } finally {
          setIsSubmitting(false)
        }
      }}
      ref={ref}
      className="card mb-8 backdrop-blur-sm bg-white/80"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
        Añadir Nuevo Ejercicio
      </h2>

      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
            {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Nombre</label>
          <input
            name="name"
            type="text"
            required
            className="input-field"
            placeholder="ej. Press de Banca"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Categoría</label>
          <div className="relative">
            <select name="category" className="select-field bg-white/50 cursor-pointer hover:bg-white transition-colors">
              <option value="Strength">Fuerza</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibilidad</option>
              <option value="Other">Otro</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Descripción</label>
          <textarea
            name="description"
            className="input-field min-h-[100px]"
            placeholder="Descripción opcional..."
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full md:w-auto px-8 py-3 shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Añadiendo...' : 'Añadir Ejercicio'}
          </button>
        </div>
      </div>
    </form>
  )
}
