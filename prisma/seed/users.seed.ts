import { Prisma, PrismaClient } from "@prisma/client"

import { hash } from 'bcrypt'
const prisma = new PrismaClient()
export async function UsersSeed() {
    const role = await prisma.roles.findMany({
        orderBy: {
            name: 'asc'
        }
    })
    // return console.log(role);
    
    const data: Prisma.usersCreateManyInput[] =
        [
            {
                username: "admin",
                password: await hash("password", 12),
                role_id: role[0].id
            },
            {
                username: "kesiswaan",
                password: await hash("password", 12),
                role_id: role[2].id
            },
            {
                username: "tata usaha",
                password: await hash("password", 12),
                role_id: role[4].id
            },
            {
                username: "ps cicurug 1",
                password: await hash("password", 12),
                role_id: role[1].id
            },
            {
                username: "ps cicurug 5",
                password: await hash("password", 12),
                role_id: role[1].id
            },
            {
                username: "ps cisarua 4",
                password: await hash("password", 12),
                role_id: role[1].id
            },
            {
                username: "ps cibedug 1",
                password: await hash("password", 12),
                role_id: role[1].id
            },
            {
                username: "ps cibedug 3",
                password: await hash("password", 12),
                role_id: role[1].id
            },
        ]

    await prisma.users.create({ data: data[0] })
    await prisma.users.create({ data: data[1] })
    await prisma.users.create({ data: data[2] })
    await prisma.users.create({ data: data[3] })
    await prisma.users.create({ data: data[4] })
    await prisma.users.create({ data: data[5] })
    await prisma.users.create({ data: data[6] })
    await prisma.users.create({ data: data[7] })
    
}