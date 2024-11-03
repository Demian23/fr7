import { Request, Response } from 'express'
import { MoviesService } from '../services/movies.service'

export class MoviesController {
    private serv = new MoviesService()

    getMovies = async (_: Request, res: Response) => {
        const movies = await this.serv.getMoviesBrief()
        res.send({ movies })
    }
}
