import {Request, Response, NextFunction} from 'express';
import { MoviesService } from "../services/moviesService.js";
import { Fr7Error } from '../errors/Fr7Errors.js';

export class MoviesController{
    private serv = new MoviesService();

    // user can access list of movies without authentication 
    getMovies = async (_: Request, res: Response) => {
        const movies = await this.serv.getMoviesBrief();
        res.render('movies', {movies}); 
    }

    getMovieById = async (req: Request, res: Response, next: NextFunction) => {
        const movieId = parseInt(req.params.id);
        const userId = req.cookies.userId ? parseInt(req.cookies.userId) : null;
        if(userId){
            try{
                const movie = await this.serv.getMovie(movieId, userId);
                res.render('movie', {movie});
            } catch (err){
                next(err);
            }
        } else {
            next(new Fr7Error('Not authorized', 500));
        }
    }

    setMovieMark = async (req: Request, res: Response, next: NextFunction) => {
        const movieId = parseInt(req.params.id);
        const userId = req.cookies.userId ? parseInt(req.cookies.userId) : null;
        if(userId){
            const newMark = parseInt(req.body.value);
            try{
                await this.serv.setMark(movieId, userId, newMark);
                const movie = await this.serv.getMovie(movieId, userId);
                res.render('movie', {movie});
            } catch(err){
                next(err);
            }
        } else {
            next(new Fr7Error('Not authorized', 500));
        }
    }
}
