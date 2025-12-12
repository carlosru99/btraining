'use client'

import { registerUser } from "@/app/actions"
import Link from "next/link"
import { useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function RegisterForm() {
  const ref = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('token')

  if (!inviteToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center relative">
        <div className="card w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Registro Restringido</h2>
          <p className="text-gray-600 mb-6">
            El registro de nuevas cuentas está disponible solo por invitación. 
            Por favor, contacta a tu entrenador para obtener un enlace de registro.
          </p>
          <Link href="/login" className="btn-primary w-full py-3 block">
            Volver al Inicio de Sesión
          </Link>
        </div>
      </div>
    )
  }

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
          {inviteToken && <input type="hidden" name="inviteToken" value={inviteToken} />}
          
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
            className="btn-primary w-full py-3 text-base shadow-lg shadow-orange-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </span>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
