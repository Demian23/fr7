import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { User, UserSignUp } from '../dto/user'
import { BadRequest, Unauthorized } from '../errors/errors'
import jwt from 'jsonwebtoken'

const accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET || 'NOSECRETUSED'

function userSignUpOrThrow(value: any): value is UserSignUp {
    if (
        (value as UserSignUp).email !== undefined &&
        (value as UserSignUp).login !== undefined &&
        (value as UserSignUp).password !== undefined
    )
        return true
    else throw new BadRequest('For sign up fill: email, login, password')
}

function userSignInOrThrow(value: any): value is UserSignUp {
    if (
        (value as UserSignUp).email !== undefined &&
        (value as UserSignUp).password !== undefined
    )
        return true
    else throw new BadRequest('For sign in fill: email, password')
}

export class UserController {
    private serv = new UserService()

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        const userInfo = req.body
        try {
            userSignUpOrThrow(userInfo)
            const { access, refresh, msRefreshExpire } =
                await this.serv.createUser(userInfo)
            res.cookie('refreshToken', refresh, {
                httpOnly: true,
                maxAge: msRefreshExpire
            })
            res.json({ accessToken: access })
        } catch (e: any) {
            next(e)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const userInfo = req.body
        try {
            userSignInOrThrow(userInfo)
            const { access, refresh, msRefreshExpire } =
                await this.serv.signIn(userInfo)
            res.cookie('refreshToken', refresh, {
                httpOnly: true,
                maxAge: msRefreshExpire
            })
            res.json({ accessToken: access })
        } catch (e) {
            next(e)
        }
    }

    refreshAccessToken = async (req: Request, res: Response) => {
        const refresh = req.cookies.refreshToken
        if (refresh) {
            const newTokens = await this.serv.refreshAccessToken(refresh)
            if (newTokens) {
                res.cookie('refreshToken', newTokens.refresh, {
                    httpOnly: true,
                    maxAge: newTokens.msRefreshExpire
                })
                res.json({ accessToken: newTokens.access })
                return
            }
        }
        res.sendStatus(Unauthorized.code)
    }

    getInfo = async (req: Request, res: Response) => {
        const token = req.headers['authorization']!.split(' ')[1]
        // hope not fail
        try {
            const user = jwt.verify(token, accessSecret)
            const info = user as User
            res.json({
                id: info.id,
                role: info.role,
                email: info.email,
                login: info.login
            })
        } catch (e) {
            res.sendStatus(Unauthorized.code)
        }
    }
}
