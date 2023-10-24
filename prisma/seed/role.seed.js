import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export async function role_seed(){
    await prisma.roles.createMany({
        data: [
            {
                name: 'Pegawai'
            },
            {
                name: 'Admin'
            },
            {
                name: 'Guru'
            },
            {
                name: 'Tata Usaha'
            },
            {
                name: 'Kesiswaan'
            }
        ]
    })
}