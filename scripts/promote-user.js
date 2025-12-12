const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.log('Please provide an email address as an argument.')
    console.log('Usage: node scripts/promote-user.js user@example.com')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    console.log(`✅ Success! User ${user.email} is now an ADMIN.`)
    console.log('You should now see the Admin Dashboard when you log in.')
  } catch (e) {
    if (e.code === 'P2025') {
        console.error(`❌ Error: User with email '${email}' not found.`)
    } else {
        console.error('❌ Error:', e)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
