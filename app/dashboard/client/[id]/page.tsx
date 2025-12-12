import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import DashboardClient from "@/components/DashboardClient"

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ClientView({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'TRAINER')) {
    redirect('/dashboard')
  }

  const client = await prisma.user.findUnique({
    where: { id }
  })

  if (!client) {
    redirect('/dashboard')
  }

  // Trainers and Admins can view any client
  
  const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
  })

  const logs = await prisma.exerciseLog.findMany({
      where: { userId: client.id },
      include: { exercise: true },
      orderBy: { date: 'desc' },
      take: 100 
  })

  return (
    <div className="relative">
        <div className="mb-4">
            <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                 Volver a mis clientes
            </a>
        </div>
        <DashboardClient user={client} exercises={exercises} logs={logs} isAdminView={true} />
    </div>
  )
}
