// backend/seeds/seedsUser.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);
  const user = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log("User admin created!", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
