import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function StudentSeed() {
    const status = await prisma.status.findFirst({
        where: {
            status: {
                contains: 'alpa'
            }
        }
    });
    const data: Prisma.studentsCreateManyInput[] = [
        {
            name: "Alif Naufal Hermawan",
            nis: "12108304",
            rayon_id: 1,
            rombel_id: 3,
            whatsapp_number: "+6285882232912",
            status_id: status.id
        },
        {
            name: "Raden Raply Pradana",
            nis: "12108409",
            rayon_id: 2,
            rombel_id: 3,
            whatsapp_number: "+62897263540",
            status_id: status.id
        },
        {
            name: "Daniel Prawira Pratama",
            nis: "121087890",
            rayon_id: 5,
            rombel_id: 3,
            whatsapp_number: "+62890123456",
            status_id: status.id
        },
        {
            name: "Aghiesna Nayla Solihin",
            nis: "12108405",
            rayon_id: 3,
            rombel_id: 3,
            whatsapp_number: "+62897788923",
            status_id: status.id
        },
        {
            name: "Maulana Yusuf",
            nis: "12108909",
            rayon_id: 3,
            rombel_id: 3,
            whatsapp_number: "+62897788923",
            status_id: status.id
        },
    ];
    await prisma.students.createMany({
        data,
    });
}
