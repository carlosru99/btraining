'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    setLoading(false)

    if (result?.ok) {
      router.push('/dashboard')
    } else {
      alert('Login failed')
    }
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
          <h2 className="text-4xl font-extrabold tracking-tight heading-gradient mb-2">Bienvenido de Nuevo</h2>
          <p className="text-gray-500">Inicia sesión para continuar tu progreso</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="tu@ejemplo.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
              <Link href="/forgot-password" className="text-xs font-medium text-amber-600 hover:text-amber-700">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Iniciar Sesión'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta? <Link href="/register" className="text-primary font-semibold hover:underline">Crea una</Link>
        </p>
      </div>
    </div>
  )
}
