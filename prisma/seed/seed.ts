import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    // await prisma.roles.createMany({
    //     data: [
    //         {
    //             name: 'Pegawai'
    //         },
    //         {
    //             name: 'Admin'
    //         },
    //         {
    //             name: 'Guru'
    //         },
    //         {
    //             name: 'Tata Usaha'
    //         },
    //         {
    //             name: 'Kesiswaan'
    //         }
    //     ]
    // })

    await prisma.users.createMany({
        data: [
            {
                username: 'Pegawai 1',
                password: await hash('password', 12),
                role_id: 1,
            },
            {
                username: 'Admin',
                password: await hash('password', 12),
                role_id: 2
            },
            {
                username: 'PS Cicurug 1',
                password: await hash('password', 12),
                role_id: 3
            },
            {
                username: 'Tata Usaha',
                password: await hash('password', 12),
                role_id: 4
            },
            {
                username: 'Kesiswaan',
                password: await hash('password', 12),
                role_id: 5
            }
        ]
    })
    // await prisma.majors.createMany({
    //     data: [
    //         {
    //             name: 'PPLG'
    //         },
    //         {
    //             name: 'KLN'
    //         },
    //         {
    //             name: 'DKV'
    //         },
    //         {
    //             name: 'HTL'
    //         },
    //         {
    //             name: 'TKJT'
    //         },
    //         {
    //             name: 'PMN'
    //         },
    //         {
    //             name: 'MPLB'
    //         },
    //     ]
    // })


    // await prisma.rombels.createMany({
    //     data: [
    //         {
    //             major_id: 1,
    //             rombel: 'X'
    //         },
    //         {
    //             major_id: 1,
    //             rombel: 'XI'
    //         },
    //         {
    //             major_id: 1,
    //             rombel: 'XII'
    //         },
    //         {
    //             major_id: 2,
    //             rombel: 'X'
    //         },
    //         {
    //             major_id: 2,
    //             rombel: 'XI'
    //         },
    //         {
    //             major_id: 2,
    //             rombel: 'XII'
    //         },
    //         {
    //             major_id: 3,
    //             rombel: 'X'
    //         },
    //         {
    //             major_id: 3,
    //             rombel: 'XI'
    //         },
    //         {
    //             major_id: 3,
    //             rombel: 'XII'
    //         },
    //         {
    //             major_id: 4,
    //             rombel: 'X'
    //         },
    //         {
    //             major_id: 4,
    //             rombel: 'XI'
    //         },
    //         {
    //             major_id: 4,
    //             rombel: 'XII'
    //         },
    //         {
    //             major_id: 5,
    //             rombel: 'X'
    //         },
    //         {
    //             major_id: 5,
    //             rombel: 'XI'
    //         },
    //         {
    //             major_id: 5,
    //             rombel: 'XII'
    //         },
    //         {
    //             major_id: 6,
    //             rombel: 'X'
    //         },
    //         {
    //             major_id: 6,
    //             rombel: 'XI'
    //         },
    //         {
    //             major_id: 6,
    //             rombel: 'XII'
    //         },
    //         {
    //             major_id: 7,
    //             rombel: 'X'
    //         },
    //         {
    //             major_id: 7,
    //             rombel: 'XI'
    //         },
    //         {
    //             major_id: 7,
    //             rombel: 'XII'
    //         },
    //     ]
    // })


    // await prisma.rayons.createMany({
    //     data: [
    //         {
    //             name: 'Cicurug'
    //         },
    //         {
    //             name: 'Cisarua'
    //         },
    //         {
    //             name: 'Cibedug'
    //         },
    //         {
    //             name: 'Ciawi'
    //         },
    //         {
    //             name: 'Tajur'
    //         },
    //         {
    //             name: 'Sukasari'
    //         },
    //         {
    //             name: 'Wikrama'
    //         },
    //     ]
    // })

    // await prisma.students.create({
    //     data: {
    //         name: 'Alif Naufal Hermawan',
    //         nis: '12108304',
    //         rayon: {
    //             connect: {
    //                 id: 1
    //             }
    //         },
    //         rombel: {
    //             connect: {
    //                 id: 3
    //             }
    //         },
    //         whatsapp_number: '+6285882232912'
    //     }
    // })

    // await prisma.students.createMany({
    //     data: [
    //         {
    //             name: 'Alif Naufal Hermawan',
    //             nis: '12108304',
    //             rayon_id: 1,
    //             rombel_id: 3,
    //             whatsapp_number: '+6285882232912'
    //         },
    //         {
    //             name: 'Raden Raply Pradana',
    //             nis: '12108409',
    //             rayon_id: 2,
    //             rombel_id: 3,
    //             whatsapp_number: '+62897263540'
    //         },
    //         {
    //             name: 'Daniel Prawira Pratama',
    //             nis: '121087890',
    //             rayon_id: 5,
    //             rombel_id: 3,
    //             whatsapp_number: '+62890123456'
    //         },
    //         {
    //             name: 'Aghiesna Nayla Solihin',
    //             nis: '12108405',
    //             rayon_id: 3,
    //             rombel_id: 3,
    //             whatsapp_number: '+62897788923'
    //         },
    //     ]
    // })


    // await prisma.employee.createMany({
    //     data: [
    //         {
    //             name: 'Camink',
    //             nip: '119203456',
    //             role_id: 1,
    //             whatsapp_number: '+6283476541290',
    //         },
    //         {
    //             name: 'Syarifah',
    //             nip: '11980908765',
    //             role_id: 3,
    //             whatsapp_number: '+6280909708921',
    //             rayon_id: 1
    //         },
    //         {
    //             name: 'Rizal',
    //             nip: '119876787',
    //             role_id: 3,
    //             whatsapp_number: '+62878822349',
    //             rayon_id: 2
    //         },
    //         {
    //             name: 'Muslih',
    //             nip: '1197889232',
    //             role_id: 3,
    //             whatsapp_number: '+628897798623',
    //             rayon_id: 3
    //         },
    //     ]
    // })
}

main()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });