import { Prisma, PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { EmployeeSeed } from './employee.seed'
import { StatusSeed } from './status.seed'
import { RayonSeed } from './rayon.seed'
import { MajorSeed } from './major.seed'
import { RombelSeed } from './rombel.seed'
import { StudentSeed } from './student.seed'
import { UsersSeed } from './users.seed'
const prisma = new PrismaClient()
async function main() {
    await StatusSeed()
    await RayonSeed()
    await MajorSeed()
    await RombelSeed()
    await StudentSeed()
    await UsersSeed
    await EmployeeSeed()
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })