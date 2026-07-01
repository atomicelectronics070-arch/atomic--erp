const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');

const newModels = `
model CoordinationDaily {
  id        String   @id @default(cuid())
  date      DateTime @default(now())
  openTime  DateTime?
  closeTime DateTime?
  notices   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  followUps   CoordinationFollowUp[]
  reports     CoordinationReport[]
  assignments CoordinationAssignment[]
}

model CoordinationFollowUp {
  id              String   @id @default(cuid())
  dailyId         String
  clientName      String
  phone           String?
  case            String?
  responsibleType String   @default("ASESOR")
  advisorId       String?
  createdAt       DateTime @default(now())
  
  daily           CoordinationDaily @relation(fields: [dailyId], references: [id])
}

model CoordinationReport {
  id          String   @id @default(cuid())
  dailyId     String
  type        String   @default("B2B") // B2B or ZOOM
  q1          String?
  q2          String?
  q3          String?
  q4          String?
  notes       String?
  createdAt   DateTime @default(now())
  
  daily       CoordinationDaily @relation(fields: [dailyId], references: [id])
}

model CoordinationAssignment {
  id        String   @id @default(cuid())
  dailyId   String
  objective String?
  amount    Int      @default(0)
  advisorId String?
  origin    String?
  createdAt DateTime @default(now())
  
  daily     CoordinationDaily @relation(fields: [dailyId], references: [id])
}
`;

fs.appendFileSync(schemaPath, newModels);
console.log('Appended successfully');
