import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function StatusSeed() {
    const status = await prisma.status.findFirst({
        where: {
            status: {
                contains: 'alpa'
            }
        }
    });
    const data: Prisma.statusCreateManyInput[] = [
        {
            status: 'ALPA'
        },
        {
            status: 'HADIR'
        },
        {
            status: 'SAKIT'
        },
        {
            status: 'IZIN'
        },

    ];
    await prisma.status.createMany({
        data,
    });
}
