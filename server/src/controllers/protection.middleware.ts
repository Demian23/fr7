import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Unauthorized } from '../errors/errors'

const accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET || 'NOSECRETUSED'

const protection = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token) {
        try {
            jwt.verify(token, accessSecret)
            next()
            return
        } catch (e) {
            console.log(e)
        }
    }
    res.sendStatus(Unauthorized.code)
}

export default protection
