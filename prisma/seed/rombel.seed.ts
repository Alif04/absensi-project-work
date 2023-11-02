import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export async function RombelSeed() {

    await prisma.rombels.createMany({
        data: [
            {
                major_id: 1,
                rombel: 'X'
            },
            {
                major_id: 1,
                rombel: 'XI'
            },
            {
                major_id: 1,
                rombel: 'XII'
            },
            {
                major_id: 2,
                rombel: 'X'
            },
            {
                major_id: 2,
                rombel: 'XI'
            },
            {
                major_id: 2,
                rombel: 'XII'
            },
            {
                major_id: 3,
                rombel: 'X'
            },
            {
                major_id: 3,
                rombel: 'XI'
            },
            {
                major_id: 3,
                rombel: 'XII'
            },
            {
                major_id: 4,
                rombel: 'X'
            },
            {
                major_id: 4,
                rombel: 'XI'
            },
            {
                major_id: 4,
                rombel: 'XII'
            },
            {
                major_id: 5,
                rombel: 'X'
            },
            {
                major_id: 5,
                rombel: 'XI'
            },
            {
                major_id: 5,
                rombel: 'XII'
            },
            {
                major_id: 6,
                rombel: 'X'
            },
            {
                major_id: 6,
                rombel: 'XI'
            },
            {
                major_id: 6,
                rombel: 'XII'
            },
            {
                major_id: 7,
                rombel: 'X'
            },
            {
                major_id: 7,
                rombel: 'XI'
            },
            {
                major_id: 7,
                rombel: 'XII'
            },
        ]
    });
}