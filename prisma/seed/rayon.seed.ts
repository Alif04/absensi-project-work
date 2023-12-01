import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export async function RayonSeed() {

    const data = [
        { name: `Cicurug 1` },
        { name: `Cicurug 2` },
        { name: `Cicurug 3` },
        { name: `Cicurug 4` },
        { name: `Cicurug 5` },
        { name: `Cicurug 6` },
        { name: `Cicurug 7` },
        { name: `Cicurug 8` },
        { name: `Cicurug 9` },
        { name: `Cicurug 10` },
        { name: `Cisarua 1` },
        { name: `Cisarua 2` },
        { name: `Cisarua 3` },
        { name: `Cisarua 4` },
        { name: `Cisarua 6` },
        { name: `Cisarua 7` },
        { name: `Ciawi 1` },
        { name: `Ciawi 2` },
        { name: `Ciawi 3` },
        { name: `Ciawi 4` },
        { name: `Ciawi 5` },
        { name: `Ciawi 6` },
        { name: `Cibedug 1` },
        { name: `Cibedug 2` },
        { name: `Cibedug 3` },
        { name: `Sukasari 1` },
        { name: `Sukasari 2` },
        { name: `Sukasari 3` },
        { name: `Wikrama 1` },
        { name: `Wikrama 2` },
        { name: `Wikrama 3` },
        { name: `Wikrama 4` },
        { name: `Tajur 1` },
        { name: `Tajur 2` },
        { name: `Tajur 3` },
        { name: `Tajur 4` },
        { name: `Tajur 5` },

    ]

    // return console.log(DataTransfer);


    await prisma.rayons.createMany({
        data
    })
}