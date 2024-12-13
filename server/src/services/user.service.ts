import UserRepository from '../repositories/user.repository'
import { UserSignUp, User, Role, UserSignIn } from '../dto/user'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Fr7Error, Unauthorized } from '../errors/errors'
import { RefreshToken } from '@prisma/client'

const accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET || 'NOSECRETUSED'
const accessExpirySeconds = process.env.AUTH_ACCESS_TOKEN_EXPIRY_S || 30
const refreshExpiryHours = process.env.AUTH_REFRESH_TOKEN_EXPIRY_H || 10

function generateAccessToken(user: User) {
    return jwt.sign(user, accessSecret, {
        expiresIn: Number(accessExpirySeconds)
    })
}

function generateRefreshToken() {
    // TODO add more complicated logic connected with refresh secret
    return crypto.randomBytes(16).toString('base64url')
}

export interface AuthResult {
    access: string
    refresh: string
    msRefreshExpire: number
}

export class UserService {
    private rep = new UserRepository()

    // TODO dont send password in open way
    createUser = async (user: UserSignUp): Promise<AuthResult> => {
        // here hashing, checks through rep on uniqunes
        // TODO create user and add refresh should be batch write
        const newUser = await this.rep.create(user, Role.user)
        const access = generateAccessToken(newUser)
        const refresh = generateRefreshToken()
        const expire = await this.addRefreshToken(refresh, newUser)
        return { access: access, refresh: refresh, msRefreshExpire: expire }
    }

    // return expiration time in milliseconds
    addRefreshToken = async (token: string, forUser: User): Promise<number> => {
        const msExpirationTime = 1000 * 60 * 60 * Number(refreshExpiryHours)
        const expireDate = new Date(Date.now() + msExpirationTime)
        await this.rep.addRefreshToken(token, forUser.id, expireDate)
        return msExpirationTime
    }

    refreshAccessToken = async (
        refresh: string
    ): Promise<AuthResult | null> => {
        const dbToken: RefreshToken | null =
            await this.rep.findRefreshToken(refresh)

        if (
            !dbToken ||
            dbToken.revoked === true ||
            dbToken.expiredAt.getTime() <= Date.now()
        )
            return null

        const userId = dbToken.userId
        const user = await this.rep.getById(userId)
        const newAccess = generateAccessToken(user)
        const newRefresh = generateRefreshToken()
        const expire = await this.addRefreshToken(newRefresh, user)
        await this.rep.revokeRefreshTokenById(dbToken.id)
        return {
            access: newAccess,
            refresh: newRefresh,
            msRefreshExpire: expire
        }
    }

    signIn = async (user: UserSignIn): Promise<AuthResult> => {
        try {
            const authenticatedUser = await this.rep.get(user)
            const access = generateAccessToken(authenticatedUser)
            const refresh = generateRefreshToken()
            const expire = await this.addRefreshToken(
                refresh,
                authenticatedUser
            )
            return { access: access, refresh: refresh, msRefreshExpire: expire }
        } catch (e) {
            if (e instanceof Fr7Error) throw new Unauthorized()
            throw e
        }
    }
}
