'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path 
    ? "bg-amber-50 text-amber-600 px-4 py-2 rounded-xl font-semibold transition-all" 
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all"

  return (
    <div className="sticky top-4 z-50 px-4 mb-8">
      <nav className="glass-panel mx-auto max-w-7xl rounded-2xl px-6 h-20 flex justify-between items-center transition-all duration-300 hover:shadow-2xl">
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <span className="text-amber-600">B</span>Training
        </Link>
        
        <div className="hidden md:flex items-center space-x-2">
          {session ? (
            <>
              <Link href="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              <Link href="/exercises" className={isActive('/exercises')}>Exercises</Link>
              {session.user?.role === 'ADMIN' && (
                <Link href="/admin" className={isActive('/admin')}>Admin</Link>
              )}
              <div className="flex items-center gap-4 ml-4">
                <span className="text-sm text-gray-500">{session.user?.name || session.user?.email}</span>
                <button 
                  onClick={() => signOut()} 
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Login</Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
