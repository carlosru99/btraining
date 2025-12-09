import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AddExerciseForm from "@/components/AddExerciseForm"
import { authOptions } from "@/lib/auth"

export default async function Exercises() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const exercises = await prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-5xl mx-auto relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-green-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>
      <div className="absolute top-40 left-0 -translate-x-12 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight heading-gradient">Exercise Library</h1>
      </div>
      
      <AddExerciseForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 pb-20">
        {exercises.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <p className="text-gray-500 font-medium">No exercises found.</p>
                <p className="text-sm text-gray-400 mt-1">Add your first exercise above to get started!</p>
            </div>
        ) : (
            exercises.map((ex: any) => (
            <div key={ex.id} className="card backdrop-blur-sm bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-white/50">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">{ex.name}</h3>
                    <span className="text-xs font-bold px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-full">{ex.category}</span>
                </div>
                {ex.description ? (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">{ex.description}</p>
                ) : (
                    <p className="text-sm text-gray-400 italic mt-2">No description provided.</p>
                )}
            </div>
            ))
        )}
      </div>
    </div>
  )
}
