import { MoviesRepository } from '../repositories/movies.repository'

export class MoviesService {
    private rep = new MoviesRepository()

    getMoviesBrief = async () => {
        return this.rep.getMoviesBriefOrderedByLaunc()
    }
}
