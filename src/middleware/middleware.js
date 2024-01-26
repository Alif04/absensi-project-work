const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const dbService = new PrismaClient();

async function middleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(400).json({ error: 'Token is Invalid' });
  try {
    const token_decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

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

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({ error: 'Token is Invalid' });
  }
}

module.exports = middleware;
