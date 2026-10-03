const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../backend/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const instCount = await prisma.institution.count();
  const projCount = await prisma.project.count();
  const appCount = await prisma.projectApplication.count();
  const qCount = await prisma.question.count();
  const ansCount = await prisma.answer.count();
  const notifCount = await prisma.notification.count();
  console.log({
    userCount,
    instCount,
    projCount,
    appCount,
    qCount,
    ansCount,
    notifCount
  });
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  });
  console.log("Users:", users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
