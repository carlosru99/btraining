import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import DashboardClient from "@/components/DashboardClient"
import TrainerDashboard from "@/components/TrainerDashboard"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
      redirect('/login')
  }

  // If user is Admin or Trainer, show Trainer Dashboard
  if (user.role === 'ADMIN' || user.role === 'TRAINER') {
    // Both Admin and Trainer see ALL clients
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { logs: true }
        },
        trainer: true
      }
    })
    
    return <TrainerDashboard user={user} clients={clients} />
  }

  // Fallback for legacy users or if logic changes (shouldn't be reached by CLIENT role due to auth check)
  const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
  })

  const logs = await prisma.exerciseLog.findMany({
      where: { userId: user.id },
      include: { exercise: true },
      orderBy: { date: 'desc' },
      take: 100 
  })

  return <DashboardClient user={user} exercises={exercises} logs={logs} />
}

