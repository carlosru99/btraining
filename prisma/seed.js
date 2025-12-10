const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {
      password,
    },
    create: {
      email: 'admin@gym.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  })
  console.log({ user })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
