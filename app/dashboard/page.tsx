import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import DashboardClient from "@/components/DashboardClient"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
      // Handle case where user exists in session but not db (shouldn't happen with correct auth)
      redirect('/login')
  }

  const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
  })

  const logs = await prisma.exerciseLog.findMany({
      where: { userId: user.id },
      include: { exercise: true },
      orderBy: { date: 'desc' },
      take: 100 // Take more for the chart
  })

  return <DashboardClient user={user} exercises={exercises} logs={logs} />
}

