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
            setMessage({ type: 'success', text: "Exercise added successfully!" })
            setTimeout(() => setMessage(null), 3000)
          }
        } catch (e) {
          setMessage({ type: 'error', text: "Something went wrong. Please try again." })
        } finally {
          setIsSubmitting(false)
        }
      }}
      ref={ref}
      className="card mb-8 backdrop-blur-sm bg-white/80"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
        Add New Exercise
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
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Name</label>
          <input
            name="name"
            type="text"
            required
            className="input-field"
            placeholder="e.g. Bench Press"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Category</label>
          <div className="relative">
            <select name="category" className="select-field bg-white/50 cursor-pointer hover:bg-white transition-colors">
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Description</label>
          <textarea
            name="description"
            className="input-field min-h-[100px]"
            placeholder="Optional description..."
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full md:w-auto px-8 py-3 shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Exercise'}
          </button>
        </div>
      </div>
    </form>
  )
}
