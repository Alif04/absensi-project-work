import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function UsersSeed() {
    const role = await prisma.roles.findMany();
    const rayon = await prisma.rayons.findMany();
    const rayon_id = rayon.map((item) => {
        return {
            id: item.id,
        };
    });
    // return console.log(rayon_id[0].id);

    const data: Prisma.usersCreateManyInput[] = [
        {
            username: "admin",
            password: "password",
            role_id: 2,
        },
        {
            username: "kesiswaan",
            password: "password",
            role_id: 5,
        },
        {
            username: "tata usaha",
            password: "password",
            role_id: 4,
        },
        {
            username: "psCicurug 1",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 2",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 3",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 4",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 5",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 6",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 7",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 8",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 9",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCicurug 10",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCisarua 1",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCisarua 2",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCisarua 3",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCisarua 4",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCisarua 5",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCisarua 6",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCisarua 7",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCibedug 1",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCibedug 2",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCibedug 3",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCiawi 1",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCiawi 2",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCiawi 3",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCiawi 4",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCiawi 5",
            password: "password",
            role_id: 3,
        },
        {
            username: "psCiawi 6",
            password: "password",
            role_id: 3,
        },
        {
            username: "psTajur 1",
            password: "password",
            role_id: 3,
        },
        {
            username: "psTajur 2",
            password: "password",
            role_id: 3,
        },
        {
            username: "psTajur 3",
            password: "password",
            role_id: 3,
        },
        {
            username: "psTajur 4",
            password: "password",
            role_id: 3,
        },
        {
            username: "psTajur 5",
            password: "password",
            role_id: 3,
        },
        {
            username: "psWikrama 1",
            password: "password",
            role_id: 3,
        },
        {
            username: "psWikrama 2",
            password: "password",
            role_id: 3,
        },
        {
            username: "psWikrama 3",
            password: "password",
            role_id: 3,
        },
        {
            username: "psWikrama 4",
            password: "password",
            role_id: 3,
        },
        {
            username: "psSukasari 1",
            password: "password",
            role_id: 3,
        },
        {
            username: "psSukasari 2",
            password: "password",
            role_id: 3,
        },
    ];

    const dataUserRayon = [
        { user_id: 5, rayon_id: 1 },
        { user_id: 6, rayon_id: 2 },
        { user_id: 7, rayon_id: 3 },
        { user_id: 9, rayon_id: 4 },
        { user_id: 10, rayon_id: 5 },
        { user_id: 11, rayon_id: 6 },
        { user_id: 12, rayon_id: 7 },
        { user_id: 13, rayon_id: 8 },
        { user_id: 14, rayon_id: 9 },
        { user_id: 15, rayon_id: 10 },
        { user_id: 16, rayon_id: 11 },
        { user_id: 17, rayon_id: 12 },
        { user_id: 18, rayon_id: 13 },
        { user_id: 19, rayon_id: 14 },
        { user_id: 20, rayon_id: 15 },
        { user_id: 21, rayon_id: 16 },
        { user_id: 25, rayon_id: 17 },
        { user_id: 26, rayon_id: 18 },
        { user_id: 27, rayon_id: 19 },
        { user_id: 28, rayon_id: 20 },
        { user_id: 29, rayon_id: 21 },
        { user_id: 30, rayon_id: 22 },
        { user_id: 22, rayon_id: 23 },
        { user_id: 23, rayon_id: 24 },
        { user_id: 24, rayon_id: 25 },
        { user_id: 40, rayon_id: 26 },
        { user_id: 41, rayon_id: 27 },
        { user_id: 36, rayon_id: 29 },
        { user_id: 37, rayon_id: 30 },
        { user_id: 38, rayon_id: 31 },
        { user_id: 39, rayon_id: 32 },
        { user_id: 31, rayon_id: 33 },
        { user_id: 32, rayon_id: 34 },
        { user_id: 33, rayon_id: 35 },
        { user_id: 34, rayon_id: 36 },
        { user_id: 35, rayon_id: 37 },
    ];



    await prisma.users.createMany({
        data,
    });

    await prisma.user_rayon.createMany({
        data: dataUserRayon,
    });
}
