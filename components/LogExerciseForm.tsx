'use client'

import { logExercise } from "@/app/actions"
import { useRef } from "react"

type Exercise = {
  id: string
  name: string
}

export default function LogExerciseForm({ exercises, onSuccess, userId }: { exercises: Exercise[], onSuccess?: () => void, userId?: string }) {
  const ref = useRef<HTMLFormElement>(null)

  return (
    <form
      action={async (formData) => {
        if (userId) {
          formData.append('userId', userId)
        }
        await logExercise(formData)
        ref.current?.reset()
        if (onSuccess) {
          onSuccess()
        } else {
          alert("Workout logged successfully!")
        }
      }}
      ref={ref}
      className="card sticky top-24 backdrop-blur-sm bg-white/80"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
        Registrar Entreno
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Ejercicio</label>
          <div className="relative">
            <select name="exerciseId" required className="select-field bg-white/50 cursor-pointer hover:bg-white transition-colors">
              <option value="">Selecciona un ejercicio...</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Peso (kg)</label>
          <input
            name="weight"
            type="number"
            step="0.5"
            required
            className="input-field"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Repeticiones</label>
          <input
            name="reps"
            type="number"
            required
            className="input-field"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Series</label>
          <input
            name="sets"
            type="number"
            required
            className="input-field"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
            RPE (Esfuerzo)
            <span className="ml-1 text-xs font-normal text-gray-500" title="Rate of Perceived Exertion: 10 = Max Effort, 1 = Very Easy">ℹ️</span>
          </label>
          <select name="rpe" className="select-field bg-white/50 cursor-pointer hover:bg-white transition-colors">
            <option value="">Seleccionar RPE...</option>
            <option value="10">10 - Esfuerzo Máximo (0 reps en reserva)</option>
            <option value="9">9 - Muy Duro (1 rep en reserva)</option>
            <option value="8">8 - Duro (2 reps en reserva)</option>
            <option value="7">7 - Moderado (3 reps en reserva)</option>
            <option value="6">6 - Fácil</option>
            <option value="5">5 - Muy Fácil</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Fecha</label>
          <input
            name="date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
            className="input-field"
          />
        </div>
        <div className="md:col-span-2 pt-4">
            <button
            type="submit"
            className="w-full btn-primary py-3.5 text-lg shadow-lg shadow-orange-500/20"
            >
            Guardar Serie
            </button>
        </div>
      </div>
    </form>
  )
}
