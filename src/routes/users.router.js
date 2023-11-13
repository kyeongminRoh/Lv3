import express from 'express'
import { prisma } from '../utils/prisma/index.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUsers } from '../joi.js'



const router = express.Router()
// 회원 가입 API
router.post('/sign-up', async (req, res, next) => {
    try {
    const validation = await createUsers.validateAsync(req.body)
    const { nickname, password, usertype } = validation
    const user = await prisma.users.findFirst({
        where: { nickname, password, usertype },
        //select: { userId: true }
    })
    console.log(user)
    if (nickname === password) {
        return res.status(401).json({ errorMessage: "아이디와 비밀번호가 같습니다."})
    }
    if (user) {
        return res.status(409).json({ errorMessage: "이미 존재하는 닉네임 입니다." })
    }
    const hashedPassword = await bcrypt.hash(password, 5)
    const users = await prisma.users.create({
        data: { 
            nickname,
            usertype,
            password: hashedPassword
        }
        
    })
    return res.status(201).json({ Message: "회원가입을 완료되었습니다." })
    } catch (error) {
        next(error)
    }
})

// 로그인 API
router.post('/sign-in', async (req, res, next) => {
    try {
    const { nickname, password } = req.body
    const user = await prisma.users.findFirst({
        where: { nickname }
    })
    if (!user) {
        return res.status(401).json({ errorMessage: "존재하지않는 이메일 입니다." })
    }
    const result = await bcrypt.compare( password, user.password )
    if (!result) {
        return res.status(401).json({ errorMessage: "일치하지 않는 비밀번호" })
    }
    
    const token = jwt.sign(
        {
            userId: user.userId,
        },
        'secret_key'
    )
    res.cookie('authorization', `Bearer ${ token }`)
    return res.status(200).json({ message: "로그인에 성공했습니다." })
    }catch (error) {
        next(error)
    }
})



export default router