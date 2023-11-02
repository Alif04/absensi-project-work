import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export async function RayonSeed() {
    const data = [
        {
            name: 'Alif Naufal Hermawan',
            nis: '12108304',
            rayon_id: 1,
            rombel_id: 3,
            whatsapp_number: '+6285882232912'
        },
        {
            name: 'Raden Raply Pradana',
            nis: '12108409',
            rayon_id: 2,
            rombel_id: 3,
            whatsapp_number: '+62897263540'
        },
        {
            name: 'Daniel Prawira Pratama',
            nis: '121087890',
            rayon_id: 5,
            rombel_id: 3,
            whatsapp_number: '+62890123456'
        },
        {
            name: 'Aghiesna Nayla Solihin',
            nis: '12108405',
            rayon_id: 3,
            rombel_id: 3,
            whatsapp_number: '+62897788923'
        },
        {
            name: 'Maulana Yusuf',
            nis: '12108909',
            rayon_id: 3,
            rombel_id: 3,
            whatsapp_number: '+62897788923'
        },
    ]
    await prisma.students.createMany({
        data
    })
}