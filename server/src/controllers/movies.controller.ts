import { Request, Response, NextFunction } from 'express'
import { MoviesService } from '../services/movies.service'
import jwt from 'jsonwebtoken'
import { User } from '../dto/user'

const accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET || 'NOSECRETUSED'

export class MoviesController {
    private serv = new MoviesService()

    getMovies = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const movies = await this.serv.getMoviesBrief()
            res.json({ ...movies })
        } catch (e: any) {
            next(e)
        }
    }

    getMovieDetailed = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const movieId = parseInt(req.params.id)
        const token = req.headers['authorization']!.split(' ')[1]
        const user = jwt.verify(token, accessSecret)
        const userId = (user as User).id
        try {
            const detailedAndMark = await this.serv.getMovieDetailedAndUserMark(
                movieId,
                userId
            )
            res.json({ ...detailedAndMark })
        } catch (err) {
            next(err)
        }
    }

    submitMovieMark = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const movieId = parseInt(req.params.id)
        const token = req.headers['authorization']!.split(' ')[1]
        const user = jwt.verify(token, accessSecret)
        const userId = (user as User).id
        // TODO check mark existing
        const mark = req.body.newMark
        try {
            await this.serv.upsertMovieMark(movieId, userId, mark)
            res.sendStatus(200)
        } catch (err) {
            next(err)
        }
    }

    deleteMovieMark = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const movieId = parseInt(req.params.id)
        const token = req.headers['authorization']!.split(' ')[1]
        const user = jwt.verify(token, accessSecret)
        const userId = (user as User).id
        try {
            await this.serv.deleteMovieMark(movieId, userId)
            res.sendStatus(202)
        } catch (err) {
            next(err)
        }
    }

    // retrive person complete info and in which movies he participate
    getPersonDetails = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const personId = parseInt(req.params.id)
        try {
            const personDetailed = await this.serv.getPersonDetailed(personId)
            res.json({ ...personDetailed })
        } catch (err) {
            next(err)
        }
    }
}
