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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return

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
      userId: user.id,
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
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) return { error: "Email and password are required" }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: "User already exists" }
  }

  const hashedPassword = await hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  })

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
