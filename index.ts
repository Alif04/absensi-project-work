import express from "express"
import { PrismaClient } from "@prisma/client"
import attendancesRoutes from "./src/attendances/routes/attendances.routes"
import authRoutes from "./src/auth/routes/user.routes"
import notAttendanceRoutes from "./src/not_attendances/routes/not_attendances.routes"
var cors = require("cors")

const dbService = new PrismaClient()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/attendance", attendancesRoutes)
app.use("/not_attendance", notAttendanceRoutes)

// Menggunakan rute yang dilindungi
async function runPrisma() {
  await dbService.$connect()
  await dbService.$queryRaw`SELECT 1 + 1`
  await dbService.$disconnect()
}

runPrisma().catch((error) => {
  console.error("Terjadi kesalahan saat menjalankan migrasi", error)
  process.exit(1)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server berjalan pada PORT ${PORT}`)
})
app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80")
})
