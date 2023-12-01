import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const dbService = new PrismaClient();

export default async function middleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(400).json({ error: "Token is Invalid" });
  try {
    const token_decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await dbService.users.findFirst({
      where: {
        id: token_decoded.user_id,
        roles: {
          name: {
            contains: token_decoded.roles,
          },
        },
      },
      include: {
        user_rayon: {
          include: {
            rayon: true,
          },
        },
      },
    });

    // console.log(user);


    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({ error: "Token is Invalid" });
  }
}
