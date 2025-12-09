import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative z-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="inline-block animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            <span className="bg-white/80 backdrop-blur-md border border-amber-200 text-amber-700 text-xs font-extrabold px-6 py-2 rounded-full uppercase tracking-widest shadow-sm hover:shadow-md transition-all cursor-default">
              The Future of Fitness
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[1.1] animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Transform Your Body <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
              Master Your Mind
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium animate-slide-up opacity-0" style={{ animationDelay: '0.3s' }}>
            Experience the ultimate platform for tracking workouts, visualizing progress, and achieving your fitness goals with professional precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
            <Link href="/register" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300">
              Start Your Journey
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-10 py-4 hover:-translate-y-1 transition-all duration-300">
              Member Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card backdrop-blur-md bg-white/70 hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-white/60 animate-slide-up opacity-0" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-8 text-orange-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <svg width="32" height="32" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Visualize your gains with interactive charts and detailed history logs that keep you motivated.</p>
            </div>
            <div className="card backdrop-blur-md bg-white/70 hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-white/60 animate-slide-up opacity-0" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-8 text-orange-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <svg width="32" height="32" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Custom Exercises</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Create and manage your own library of exercises tailored specifically to your unique routine.</p>
            </div>
            <div className="card backdrop-blur-md bg-white/70 hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-white/60 animate-slide-up opacity-0" style={{ animationDelay: '0.7s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-8 text-orange-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <svg width="32" height="32" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-time Logging</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Log your sets, reps, and weights instantly during your workout session with our intuitive interface.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
