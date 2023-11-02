import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { RoleSeed } from "./role.seed";
import { UsersSeed } from "./users.seed";
import { RayonSeed } from "./rayon.seed";
import { MajorSeed } from "./major.seed";
import { RombelSeed } from "./rombel.seed";
const prisma = new PrismaClient();
async function main() {
  // await RoleSeed();
  await RayonSeed();
  await UsersSeed();
  await MajorSeed();
  await RombelSeed();

  //
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
