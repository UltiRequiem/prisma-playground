import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.user.findMany({ include: { posts: true } });

  console.dir(data, { depth: null });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
