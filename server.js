const express = require('express');
const { PrismaClient } = require("@prisma/client");


const dbService = new PrismaClient();
const app = express();
app.use(express.json());

async function run_prisma(){
    await dbService.$connect();
    await dbService.$queryRaw`SELECT 1 + 1`;
    await dbService.$disconnect();
}

run_prisma().catch((error) =>{
    console.error("Something error when start migrate", error);
    process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan pada prot ${PORT}`);
})

