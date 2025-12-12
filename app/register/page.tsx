'use client'

import { registerUser } from "@/app/actions"
import Link from "next/link"
import { useRef, useState } from "react"

export default function RegisterPage() {
  const ref = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl -z-10 opacity-50 pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      <div className="card w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight heading-gradient mb-2">Crear Cuenta</h2>
          <p className="text-gray-500">Comienza tu viaje fitness hoy</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form
          action={async (formData) => {
            setLoading(true)
            const result = await registerUser(formData)
            setLoading(false)
            if (result?.error) {
              setError(result.error)
            }
          }}
          ref={ref}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Nombre Completo</label>
            <input
              name="name"
              type="text"
              className="input-field"
              placeholder="Juan Pérez"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Correo Electrónico</label>
            <input
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="tu@ejemplo.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-lg shadow-lg shadow-orange-500/20"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
