import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function StudentSeed() {

    const data: Prisma.rolesCreateManyInput[] = [
        {
            name: 'PEGAWAI'
        },
        {
            name: 'ADMIN'
        },
        {
            name: 'GURU'
        },
        {
            name: 'TATA USAHA'
        },
        {
            name: 'KESISWAAN'
        },
    ];
    await prisma.roles.createMany({
        data,
    });
}
