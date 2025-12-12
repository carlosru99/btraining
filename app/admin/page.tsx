import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { deleteUser, deleteExercise } from "@/app/actions"
import CreateTrainerForm from "@/components/CreateTrainerForm"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const trainers = await prisma.user.findMany({
    where: { role: 'TRAINER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { clients: true }
      }
    }
  })

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { createdAt: 'desc' },
    include: {
      trainer: true,
      _count: {
        select: { logs: true }
      }
    }
  })

  const exercises = await prisma.exercise.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { logs: true }
      }
    }
  })

  return (
    <div className="space-y-8 relative">
      {/* Decorative background elements for Admin */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-red-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>
      <div className="absolute top-20 left-0 -translate-x-12 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl mix-blend-multiply -z-10 pointer-events-none"></div>

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold tracking-tight heading-gradient">Panel de Administración</h1>
        <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">ACCESO ADMIN</span>
      </div>

      <CreateTrainerForm />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trainers Management */}
        <div className="card backdrop-blur-sm bg-white/80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Entrenadores</h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{trainers.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-xs">
                  <th className="pb-4 font-semibold pl-2">Nombre</th>
                  <th className="pb-4 font-semibold">Email</th>
                  <th className="pb-4 font-semibold">Clientes</th>
                  <th className="pb-4 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trainers.map((trainer: any) => (
                  <tr key={trainer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-2 font-medium text-gray-900">{trainer.name || 'N/A'}</td>
                    <td className="py-4 text-gray-600">{trainer.email || 'Pendiente'}</td>
                    <td className="py-4 text-gray-600">{trainer._count.clients}</td>
                    <td className="py-4">
                        <div className="flex items-center justify-center gap-2">
                            <form action={deleteUser.bind(null, trainer.id)}>
                              <button className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors border border-red-100">Eliminar</button>
                            </form>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clients Management */}
        <div className="card backdrop-blur-sm bg-white/80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Clientes</h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{clients.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-xs">
                  <th className="pb-4 font-semibold pl-2">Nombre</th>
                  <th className="pb-4 font-semibold">Entrenador</th>
                  <th className="pb-4 font-semibold">Registros</th>
                  <th className="pb-4 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((client: any) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-2 font-medium text-gray-900">{client.name || 'N/A'}</td>
                    <td className="py-4 text-gray-600">{client.trainer?.name || 'Sin asignar'}</td>
                    <td className="py-4 text-gray-600">{client._count.logs}</td>
                    <td className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            href={`/admin/users/${client.id}`}
                            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          >
                            Ver
                          </Link>
                            <form action={deleteUser.bind(null, client.id)}>
                              <button className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors border border-red-100">Eliminar</button>
                            </form>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exercises Management */}
        <div className="card backdrop-blur-sm bg-white/80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Ejercicios</h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{exercises.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-xs">
                  <th className="pb-4 font-semibold pl-2">Nombre</th>
                  <th className="pb-4 font-semibold">Categoría</th>
                  <th className="pb-4 font-semibold">Uso</th>
                  <th className="pb-4 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {exercises.map((ex: any) => (
                  <tr key={ex.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-2 font-medium text-gray-900">{ex.name}</td>
                    <td className="py-4 text-gray-600">{ex.category}</td>
                    <td className="py-4 text-gray-600">{ex._count.logs} registros</td>
                    <td className="py-4">
                      <form action={deleteExercise.bind(null, ex.id)}>
                        <button className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors">Eliminar</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
