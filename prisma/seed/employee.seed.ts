import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function EmployeeSeed() {
  const data = [
    {
      name: "Camink",
      nip: "119203456",
      role_id: 1,
      whatsapp_number: "+6283476541290",
    },
    {
      name: "Syarifah",
      nip: "11980908765",
      role_id: 3,
      whatsapp_number: "+6280909708921",
    },
    {
      name: "Rizal",
      nip: "119876787",
      role_id: 3,
      whatsapp_number: "+62878822349",
    },
    {
      name: "Muslih",
      nip: "1197889232",
      role_id: 3,
      whatsapp_number: "+628897798623",
    },
  ];
  await prisma.employee.createMany({
    data,
  });
}
