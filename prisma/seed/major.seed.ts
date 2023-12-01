import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export async function MajorSeed() {

    await prisma.majors.createMany({
        data: [
            {
                name: 'PPLG'
            },
            {
                name: 'KLN'
            },
            {
                name: 'DKV'
            },
            {
                name: 'HTL'
            },
            {
                name: 'TKJT'
            },
            {
                name: 'PMN'
            },
            {
                name: 'MPLB'
            },
        ]
    })
}