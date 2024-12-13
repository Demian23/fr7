import { NextFunction, Request, Response } from 'express'
import { Fr7Error, InternalError } from './errors'

export default function errorHandler(
    err: any,
    _: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof Fr7Error) res.status(err.statusCode).send(err.message)
    else res.sendStatus(InternalError.code)
    console.log(err)
}
