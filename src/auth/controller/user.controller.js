const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class AuthController{
    async login(req, res){
        try{
            const {username, password } = req.body;
            if(!username || !password) return res.status(401).send({error: 'Missing data'});
            const user = await prisma.users.findFirst({
                where: {
                    username: username
                },
                include: {
                    roles: true
                }
            });
            if (!user) return res.status(401).json({ error: "User not found" });
            //FIX WHEN COMPARE USER PASSWORD AND BODY PASSWORD
            const match_password = await bcrypt.compare(password, user.password);
            if(!match_password) return res.status(400).json({error: "Password Incorrect"});
            // FIX WHEN COMPARE USER PASSWORD AND BODY PASSWORD
            // const match_password =  await bcrypt.compare(password, user.password);
            // if (!match_password) {
            //     return res.status(400).json({ error: "Password Incorrect" });
            // }

            const token = jwt.sign({user_id: user.id, user_roles: user.roles.name}, process.env.JWT_ACCESS_SECRET, {
                expiresIn: '1d'
            });
            console.log(token, user);
            return res.status(200).json({
                status: 200,
                message: 'Login Success',
                token,
                user
            })
        }catch(error){
            console.log(error);
            return res.status(400).json({
                status: 400,
                message: 'Error While Login',
                stack: error.message
            })
        }
    }
}

module.exports = AuthController;