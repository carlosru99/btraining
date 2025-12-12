'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path 
    ? "bg-amber-50 text-amber-600 px-4 py-2 rounded-xl font-semibold transition-all block" 
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all block"

  return (
    <div className="sticky top-4 z-50 px-4 mb-8">
      <nav className="glass-panel mx-auto max-w-7xl rounded-2xl px-6 min-h-[5rem] flex flex-col justify-center transition-all duration-300 hover:shadow-2xl relative">
        <div className="flex justify-between items-center w-full h-20">
          <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <span className="text-amber-600">B</span>Training
          </Link>
          
          {/* Desktop Menu */}
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

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-gray-100 animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="flex flex-col space-y-2">
              {session ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={isActive('/dashboard')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/exercises" 
                    className={isActive('/exercises')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Exercises
                  </Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className={isActive('/admin')}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3 px-4">
                    <span className="text-sm text-gray-500 font-medium">Signed in as {session.user?.name || session.user?.email}</span>
                    <button 
                      onClick={() => signOut()} 
                      className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link 
                    href="/login" 
                    className="text-gray-600 hover:text-primary font-medium transition-colors px-4 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn-primary text-center mx-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
