const express = require('express');
const { PrismaClient } = require('@prisma/client');
const attendancesRoutes = require('./src/attendances/routes/attendances.routes');
const authRoutes = require('./src/auth/routes/user.routes');
const notAttendanceRoutes = require('./src/not_attendances/routes/not_attendances.routes');
const dummyRoutes = require('./src/dummy/routes/dummy.routes');
const config = require('./config.json');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const dbService = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/attendance', attendancesRoutes);
app.use('/not_attendance', notAttendanceRoutes);
app.use('/dummy', dummyRoutes);
app.use(function (req, res, next) {
  console.log(req.method + " : " + req.path);
  next();
});

// Using protected routes
async function runPrisma() {
  await dbService.$connect();
  await dbService.$queryRaw`SELECT 1 + 1`;
  await dbService.$disconnect();
}

runPrisma().catch((error) => {
  console.error('An error occurred while running migrations', error);
  process.exit(1);
});

// const PORT = 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on PORT ${PORT}`);
// });

app.listen(7070, function () {
  console.log('CORS-enabled web server listening on port 70');
});
