'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { hash } from "bcryptjs"
import { authOptions } from "@/lib/auth"
import { randomBytes } from "crypto"
import { sendPasswordResetEmail } from "@/lib/mail"

export async function createExercise(formData: FormData) {
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string

  if (!name) return { error: "Name is required" }

  try {
    await prisma.exercise.create({
      data: {
        name,
        category,
        description,
      },
    })

    revalidatePath("/exercises")
    return { success: true }
  } catch (error) {
    console.error("Failed to create exercise:", error)
    return { error: "Failed to create exercise" }
  }
}

export async function logExercise(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!currentUser) return

  // Determine target user (Client)
  let targetUserId = currentUser.id
  const formUserId = formData.get("userId") as string

  if (formUserId) {
    // If a userId is provided, verify permission
    if (currentUser.role === 'ADMIN') {
      targetUserId = formUserId
    } else if (currentUser.role === 'TRAINER') {
      // Verify trainer owns this client
      const client = await prisma.user.findUnique({
        where: { id: formUserId }
      })
      if (client && client.trainerId === currentUser.id) {
        targetUserId = formUserId
      } else {
        return { error: "Unauthorized" }
      }
    }
  }

  const exerciseId = formData.get("exerciseId") as string
  const weight = parseFloat(formData.get("weight") as string)
  const reps = parseInt(formData.get("reps") as string)
  const sets = parseInt(formData.get("sets") as string)
  const rpe = formData.get("rpe") ? parseInt(formData.get("rpe") as string) : null
  const date = new Date(formData.get("date") as string || Date.now())

  if (!exerciseId || isNaN(weight) || isNaN(reps) || isNaN(sets)) return

  // Calculate Estimated 1RM using Epley Formula: Weight * (1 + Reps/30)
  const estimated1RM = weight * (1 + reps / 30)

  await prisma.exerciseLog.create({
    data: {
      userId: targetUserId,
      exerciseId,
      weight,
      reps,
      sets,
      rpe,
      estimated1RM,
      date,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/client/${targetUserId}`)
  revalidatePath(`/admin/users/${targetUserId}`)
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const inviteToken = formData.get("inviteToken") as string

  if (!email || !password) return { error: "Email and password are required" }

  const hashedPassword = await hash(password, 10)

  if (inviteToken) {
    const invitedUser = await prisma.user.findFirst({
      where: { inviteToken }
    })

    if (!invitedUser) {
      return { error: "Invalid or expired invitation" }
    }

    // Check if email is already taken by ANOTHER user
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUserWithEmail && existingUserWithEmail.id !== invitedUser.id) {
      return { error: "Email already in use" }
    }

    await prisma.user.update({
      where: { id: invitedUser.id },
      data: {
        name,
        email,
        password: hashedPassword,
        inviteToken: null, // Clear the token
      }
    })
  } else {
    return { error: "Public registration is currently disabled. Please contact your trainer for an invitation." }
  }

  redirect("/login")
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') return

  // Delete all logs first
  await prisma.exerciseLog.deleteMany({
    where: { userId }
  })

  await prisma.user.delete({
    where: { id: userId }
  })

  revalidatePath("/admin")
}

export async function deleteExercise(exerciseId: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') return

  // Delete all logs associated with this exercise
  await prisma.exerciseLog.deleteMany({
    where: { exerciseId }
  })

  await prisma.exercise.delete({
    where: { id: exerciseId }
  })

  revalidatePath("/admin")
  revalidatePath("/exercises")
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) return { error: "Email is required" }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    // Do not reveal if user exists
    return { success: true, message: "If an account exists with this email, you will receive a password reset link." }
  }

  const token = randomBytes(32).toString("hex")
  const expiry = new Date(Date.now() + 3600000) // 1 hour from now

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry
    }
  })

  await sendPasswordResetEmail(email, token, user.name || 'User')

  return { success: true, message: "If an account exists with this email, you will receive a password reset link." }
}

export async function resetPassword(token: string, formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) return { error: "All fields are required" }
  if (password !== confirmPassword) return { error: "Passwords do not match" }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date()
      }
    }
  })

  if (!user) {
    return { error: "Invalid or expired token" }
  }

  const hashedPassword = await hash(password, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  redirect("/login?reset=success")
}

export async function deleteLog(logId: string) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) return { error: "User not found" }

    const log = await prisma.exerciseLog.findUnique({
      where: { id: logId },
      include: { user: true }
    })

    if (!log) return { error: "Log not found" }

    // Allow deletion if user owns the log or is an admin
    if (log.userId !== user.id && user.role !== 'ADMIN') {
      return { error: "Unauthorized" }
    }

    await prisma.exerciseLog.delete({
      where: { id: logId }
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin")
    revalidatePath(`/admin/users/${log.userId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to delete log:", error)
    return { error: "Failed to delete log" }
  }
}

export async function createClient(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'TRAINER')) {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  if (!name) return { error: "Name is required" }

  try {
    // Create a client linked to the current user (Trainer/Admin)
    await prisma.user.create({
      data: {
        name,
        role: 'CLIENT',
        trainerId: session.user.id
      }
    })
    
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to create client:", error)
    return { error: "Failed to create client" }
  }
}

export async function createTrainer(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  if (!name) return { error: "Name is required" }

  const token = randomBytes(32).toString("hex")
  
  try {
    await prisma.user.create({
      data: {
        name,
        role: 'TRAINER',
        inviteToken: token,
      }
    })
    
    revalidatePath("/admin")
    return { success: true, token }
  } catch (error) {
    console.error("Failed to create trainer:", error)
    return { error: "Failed to create trainer" }
  }
}
