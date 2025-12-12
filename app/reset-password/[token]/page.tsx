'use client'

import { useState } from 'react'
import { resetPassword } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')

    const result = await resetPassword(token, formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // If successful, the server action redirects to login
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl -z-10 opacity-50 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      <div className="card w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight heading-gradient mb-2">Restablecer Contraseña</h2>
          <p className="text-gray-500">Introduce tu nueva contraseña abajo</p>
        </div>
        
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Nueva Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Confirmar Contraseña</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Restablecer Contraseña'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
