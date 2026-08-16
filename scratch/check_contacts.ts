import { prisma } from "../src/lib/prisma";

async function checkWhatsAppContacts() {
  console.log("=== WA CONTACTS ===");
  const contacts = await prisma.wAContact.findMany({
    include: { conversations: { include: { messages: { take: 5, orderBy: { createdAt: 'desc' } } } } }
  });
  console.log(JSON.stringify(contacts, null, 2));
}

checkWhatsAppContacts().catch(console.error).finally(() => process.exit(0));
