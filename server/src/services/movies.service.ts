import { MovieDetailedAndUserMark } from '../dto/combination'
import { MoviesRepository } from '../repositories/movies.repository'
import { MovieBrief } from '../dto/movie'
import { MarkModify } from '../dto/mark'
import { PersonAndMovies } from '../dto/combination'

export class MoviesService {
    private rep = new MoviesRepository()

    getMoviesBrief = async (): Promise<MovieBrief[]> => {
        return await this.rep.getMoviesBriefOrderedByLaunch()
    }

    // TODO add refresh and access processing here
    getMovieDetailedAndUserMark = async (
        byId: number,
        fromUserId: number
    ): Promise<MovieDetailedAndUserMark> => {
        return await this.rep.getMovieDetailedForUser(byId, fromUserId)
    }

    upsertMovieMark = async (
        movieId: number,
        userId: number,
        mark: number
    ): Promise<MarkModify> => {
        // TODO check movie exist
        return await this.rep.upsertMovieMark(movieId, userId, mark)
    }

    deleteMovieMark = async (
        movieId: number,
        userId: number
    ): Promise<void> => {
        await this.rep.deleteMovieMark(movieId, userId)
    }

    getPersonDetailed = async (personId: number): Promise<PersonAndMovies> => {
        const person = await this.rep.getPerson(personId)
        const moviesAndRelations =
            await this.rep.getPersonRelatedMovies(personId)
        return { person: person, moviesAndRelations: moviesAndRelations }
    }
}
