import { prisma } from '@/lib/prisma';

export async function GET() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const count = await prisma.user.count({
    where: {
      updatedAt: {
        gte: fiveMinutesAgo,
      },
    },
  });
  return Response.json({ online: count });
} 