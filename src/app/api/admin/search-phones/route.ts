import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Buscar Honor Magic 7 u 8
    const honorMagic = await prisma.product.findMany({
      where: {
        AND: [
          { name: { contains: 'honor', mode: 'insensitive' } },
          { name: { contains: 'magic', mode: 'insensitive' } },
        ],
        isDeleted: false,
      },
    });

    // 2. Buscar cualquier Honor
    const allHonor = await prisma.product.findMany({
      where: {
        name: { contains: 'honor', mode: 'insensitive' },
        isDeleted: false,
      },
      take: 20,
    });

    // 3. Buscar celulares / teléfonos / smartphones en la DB
    const allPhones = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'celular', mode: 'insensitive' } },
          { name: { contains: 'phone', mode: 'insensitive' } },
          { name: { contains: 'redmi', mode: 'insensitive' } },
          { name: { contains: 'xiaomi', mode: 'insensitive' } },
          { name: { contains: 'samsung', mode: 'insensitive' } },
          { name: { contains: 'iphone', mode: 'insensitive' } },
          { name: { contains: 'infinix', mode: 'insensitive' } },
          { name: { contains: 'tecno', mode: 'insensitive' } },
        ],
        isDeleted: false,
      },
      take: 30,
    });

    return NextResponse.json({
      honor_magic_7_8: honorMagic,
      all_honor_in_db: allHonor,
      other_phones_in_db: allPhones,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
