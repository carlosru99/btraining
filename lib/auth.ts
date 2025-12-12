import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          console.log("User not found:", credentials.email)
          return null
        }

        // Only ADMIN and TRAINER can log in
        if (user.role === 'CLIENT') {
          console.log("Client login attempt denied:", credentials.email)
          return null
        }
        
        // If user has no password (e.g. invited user who hasn't claimed account), deny login
        if (!user.password) {
          console.log("User has no password set:", credentials.email)
          return null
        }
        
        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
           console.log("Invalid password for user:", credentials.email)
           return null
        }
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role
        }
        return token
      },
      async session({ session, token }) {
          if (session.user && token.sub) {
              // @ts-ignore
              session.user.id = token.sub;
              // @ts-ignore
              session.user.role = token.role;
          }
          return session;
      }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
