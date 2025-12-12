'use client'

import { useState } from 'react'
import { forgotPassword } from '@/app/actions'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setMessage('')
    setError('')

    const result = await forgotPassword(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.message) {
      setMessage(result.message)
    }
    
    setLoading(false)
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
          <h2 className="text-3xl font-extrabold tracking-tight heading-gradient mb-2">Recuperar Contraseña</h2>
          <p className="text-gray-500">Introduce tu email para restablecer tu contraseña</p>
        </div>
        
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Correo Electrónico</label>
            <input
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="juan@ejemplo.com"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
              {message}
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
              'Enviar Enlace de Recuperación'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ¿Recuerdas tu contraseña?{' '}
            <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
