const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Middleware {
    async middlewareTU(req, res, next){
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if(!token) return res.status(400).json({error: "Token is Invalid"});
        try{
            const token_decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            const user = await prisma.users.findFirst({
                where: {
                    id: token_decoded.user_id,
                    roles: {
                        name: {
                            contains: 'Tata Usaha'
                        }
                    }
                }
            });

            if(!user) return res.status(400).json({error: "Role Invalid"});

            req.user = user;

            next()
        }catch(error){
            return res.status(400).json({error: "Token is Invalid"});
        }
    }

    async middlewareAdmin(req, res, next){
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if(!token) return res.status(400).json({error: "Token is Invalid"});
        try{
            const token_decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            const user = await prisma.users.findFirst({
                where: {
                    id: token_decoded.user_id,
                    roles: {
                        name: {
                            contains: 'Admin'
                        }
                    }
                }
            });

            if(!user) return res.status(400).json({error: "Role Invalid"});

            req.user = user;

            next()
        }catch(error){
            return res.status(400).json({error: "Token is Invalid"});
        }
    }

    async middlewareKesiswaan(req, res, next){
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if(!token) return res.status(400).json({error: "Token is Invalid"});
        try{
            const token_decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            const user = await prisma.users.findFirst({
                where: {
                    id: token_decoded.user_id,
                    roles: {
                        name: {
                            contains: 'Kesiswaan'
                        }
                    }
                }
            });

            if(!user) return res.status(400).json({error: "Role Invalid"});

            req.user = user;

            next()
        }catch(error){
            return res.status(400).json({error: "Token is Invalid"});
        }
    }
}

module.exports = Middleware;