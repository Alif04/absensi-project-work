import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

export default class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) throw new Error("Missing Data");

      const usersWithUserRayon = await prisma.users.findMany({
        where: {
          NOT: {
            user_rayon: undefined,
          },
          username: username,
        },
        include: {
          roles: true,
          user_rayon: {
            select: {
              rayon_id: true,
              rayon: true,
            },
          },
        },
      });

      const usersWithoutUserRayon = await prisma.users.findMany({
        where: {
          user_rayon: {
            every: {
              rayon_id: undefined,
            },
          },
          username: username,
        },
        include: {
          roles: true,
        },
      });

      let user;

      if (usersWithUserRayon.length > 0) {
        user = usersWithUserRayon[0]; // Ambil salah satu user dengan user_rayon
      } else if (usersWithoutUserRayon.length > 0) {
        user = usersWithoutUserRayon[0]; // Ambil salah satu user tanpa user_rayon
      }

      if (!user) {
        throw new Error("User not found!");
      }

      // Periksa kata sandi
      const match_password = await bcrypt.compare(password, user.password);

      if (!match_password) {
        return res.status(400).json({ error: "Password Incorrect" });
      }

      const token = jwt.sign(
        {
          user_id: user.id,
          user_roles: user.roles.name,
          rayon_id:
            user.user_rayon && user.user_rayon[0]
              ? user.user_rayon[0].rayon_id
              : undefined,
        },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // console.log(token, user);
      return res.status(200).json({
        status: 200,
        message: "Login Success",
        token,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: error.message,
        stack: error,
      });
    }
  }

  async register(req, res) {
    try {
      const { username, password, role_id } = req.body;
      if (!username || !password) throw new Error("Missing Data");
      const role = await prisma.roles.findFirst({
        where: {
          id: role_id
        }
      });

      if (!role) throw new Error('Role not found!');

      const users = await prisma.users.create({
        data: {
          username,
          password: await hash(password, 12),
          roles: {
            connect: {
              id: role.id
            }
          }
        }
      });


      return res.status(200).json({
        status: 200,
        message: "Register Success",
        user: users,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: error.message,
        stack: error,
      });
    }
  }
}

module.exports = AuthController;
