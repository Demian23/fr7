import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Role, User, UserSignIn, UserSignUp } from '../dto/user'
import {
    BadRequest,
    InternalError,
    NotFound,
    ResourceConflict
} from '../errors/errors'

import crypto from 'crypto'
import db from './db'

function roleToString(role: Role) {
    switch (role) {
        case Role.user:
            return 'USER'
        case Role.admin:
            return 'ADMIN'
    }
}

function stringToRole(role: string) {
    switch (role) {
        case 'USER':
            return Role.user
        case 'ADMIN':
            return Role.admin
    }
    return Role.user
}

function hash(value: any) {
    return crypto.createHash('sha512').update(value).digest('hex')
}

class UserRepository {
    create = async function (user: UserSignUp, role: Role): Promise<User> {
        const passwordHash = hash(user.password)
        try {
            const created = await db.user.create({
                data: {
                    login: user.login,
                    email: user.email,
                    password: passwordHash,
                    role: roleToString(role)
                }
            })
            return {
                id: created.id,
                email: created.email,
                login: created.login,
                role: stringToRole(created.role)
            }
        } catch (e: any) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002')
                    throw new ResourceConflict(`${user.email} is busy`)
            }
            // TODO write normal error processing
            throw new BadRequest()
        }
    }

    // TODO problem refresh tokens need maintainance, they need to be deleted
    // some time, and even revoked. Maybe some stored procedure with event trigger
    addRefreshToken = async function (
        token: string,
        userId: number,
        expireDate: Date
    ) {
        try {
            await db.refreshToken.create({
                data: {
                    hashedVal: hash(token),
                    userId: userId,
                    expiredAt: expireDate
                }
            })
        } catch (e) {
            throw new InternalError()
        }
    }

    findRefreshToken = async function (token: string) {
        try {
            return await db.refreshToken.findUnique({
                where: { hashedVal: hash(token) }
            })
        } catch (e) {
            throw new InternalError()
        }
    }

    revokeRefreshTokenById = async function (tokenId: number) {
        try {
            return await db.refreshToken.update({
                where: { id: tokenId },
                data: { revoked: true }
            })
        } catch (e) {
            throw new InternalError()
        }
    }

    get = async function (user: UserSignIn): Promise<User> {
        const passwordHash = hash(user.password)
        const dbUser = await db.user.findUnique({
            where: { email: user.email }
        })
        if (dbUser)
            if (dbUser.password === passwordHash)
                return {
                    id: dbUser.id,
                    email: dbUser.email,
                    login: dbUser.login,
                    role: stringToRole(dbUser.role)
                }
            else new BadRequest('Wrong password')
        throw new NotFound()
    }

    getById = async function (userId: number): Promise<User> {
        const dbUser = await db.user.findUnique({ where: { id: userId } })
        if (dbUser)
            return {
                id: dbUser.id,
                email: dbUser.email,
                login: dbUser.login,
                role: stringToRole(dbUser.role)
            }
        throw new NotFound()
    }
}

export default UserRepository
