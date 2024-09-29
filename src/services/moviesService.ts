import { NotFound } from "../errors/Fr7Errors.js";
import { MoviesRepository } from "../repositories/moviesRepository.js";

export class MoviesService{

    private rep = new MoviesRepository();

    getMoviesBrief = async () => {
        return this.rep.getMoviesBriefOrderedByLaunc(); 
    }

    getMovie = async (movieId: number, userId: number) => {
        const movie = this.rep.getMovieDetailed(movieId, userId);
        if(movie){
            return movie
        } else 
            throw new NotFound(`Movie with ID ${movieId} not found`);
    }

    setMark = async (movieId: number, userId: number, mark: number) => {
        // TODO add validation? even though validate on view level
        // change to specific checks
        const movie = await this.rep.getMovieDetailed(movieId, userId);
        if(movie){
            // TODO check that user exists
            return await this.rep.setOrUpdateMovieMark(movieId, userId, mark);
        } else 
            throw new NotFound(`Movie with ID ${movieId} not found`);
    }
}
