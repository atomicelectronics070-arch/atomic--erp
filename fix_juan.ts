import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    const targetEmail = 'juanguzman7100@gmail.com' // EXACT LOWERCASE
    
    // Find exact lowercase user (the one NextAuth is querying)
    const targetUser = await prisma.user.findUnique({
      where: { email: targetEmail }
    })
    
    if (!targetUser) {
      console.log(`User with exact email ${targetEmail} NOT FOUND in database.`)
      return
    }

    console.log(`Found exact lowercase user: ID=${targetUser.id}, Status=${targetUser.status}`)
    
    // Hash new password "Atomic123!"
    const newPassword = "Atomic123!"
    const passwordHash = await bcrypt.hash(newPassword, 10)
    
    // Update user
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { 
        passwordHash: passwordHash,
        status: 'APPROVED'
      }
    })
    
    console.log(`Successfully reset password to '${newPassword}' for EXACT lowercase email '${targetUser.email}'`)
  } catch (error) {
    console.error("Error updating user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
