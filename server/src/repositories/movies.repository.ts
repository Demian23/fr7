import { NotFound } from '../errors/errors'
import db from './db'
import { MovieBrief } from '../dto/movie'
import { MovieDetailedAndUserMark } from '../dto/combination'
import { MarkModify } from '../dto/mark'
import { Mark } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { MovieAndRelation, Person, Relation } from '../dto/combination'

function plainToMoviesBrief(movie: any) {
    return {
        id: movie.id,
        title_origin: movie.title_or,
        title_ru: movie.title_ru,
        genres: movie.genres.map((genre: any) => {
            return genre.genre.value
        }),
        duration: movie.duration,
        launch: new Date(movie.launch),
        marksAmount: movie.marksAmount,
        marksScore: movie.marksScore
    }
}

function markDBtoMark(mark: Mark) {
    return {
        movieFor: mark.movieId,
        userFrom: mark.userId,
        updatedAt: mark.updatedAt,
        assignedAt: mark.assignedAt,
        value: mark.value
    }
}

export class MoviesRepository {
    getMoviesBriefOrderedByLaunch = async function (): Promise<MovieBrief[]> {
        const movies = await db.movie.findMany({
            orderBy: [{ launch: 'desc' }],
            include: {
                genres: {
                    select: {
                        genre: { select: { value: true } }
                    }
                }
            }
        })
        return movies.map(plainToMoviesBrief)
    }

    // get movie with genres, countries, mark
    // TODO here potentially when select persons, wanna select id too, cause
    // on client wanna click on person and see all movies he take part in
    getMovieDetailedForUser = async function (
        movieId: number,
        userId: number
    ): Promise<MovieDetailedAndUserMark> {
        const movie = await db.movie.findUnique({
            where: { id: movieId },
            include: {
                genres: { include: { genre: { select: { value: true } } } },
                countries: {
                    include: { country: { select: { value: true } } }
                },
                persons: {
                    include: { person: { select: { name: true } } }
                },
                marks: {
                    where: { userId: userId }
                },
                descriptions: {
                    select: { value: true }
                }
            }
        })

        if (!movie) throw new NotFound(`Movie (${movieId}) not found`)
        const mark = movie.marks[0]
        return {
            detailed: {
                movie: plainToMoviesBrief(movie),
                countries: movie.countries.map(
                    (country) => country.country.value
                ),
                directors: movie.persons
                    .filter((person) => person.relation === 'DIRECTOR')
                    .map((person) => {
                        return { id: person.personId, name: person.person.name }
                    }),
                actors: movie.persons
                    .filter((person) => person.relation === 'ACTOR')
                    .map((person) => {
                        return { id: person.personId, name: person.person.name }
                    }),
                descriptions: movie.descriptions.map(
                    (description) => description.value
                )
            },
            mark: mark ? markDBtoMark(mark) : null
        }
    }

    upsertMovieMark = async (
        movieId: number,
        userId: number,
        newMark: number
    ): Promise<MarkModify> => {
        const currentMark = await db.mark.findUnique({
            where: { movieId_userId: { movieId: movieId, userId: userId } }
        })
        if (currentMark) {
            const updateScoreOn = newMark - currentMark.value
            const markFromDB = await db.mark.update({
                where: {
                    movieId_userId: {
                        movieId: currentMark.movieId,
                        userId: currentMark.userId
                    }
                },
                data: { value: newMark }
            })

            const movieFromDB = await db.movie.update({
                where: { id: movieId },
                data: { marksScore: { increment: updateScoreOn } }
            })
            return {
                marksScore: movieFromDB.marksScore,
                marksAmount: movieFromDB.marksAmount,
                mark: markDBtoMark(markFromDB)
            }
        } else {
            const newMarkDB = await db.mark.create({
                data: {
                    value: newMark,
                    movie: { connect: { id: movieId } },
                    user: { connect: { id: userId } }
                }
            })
            const movieFromDB = await db.movie.update({
                where: { id: movieId },
                data: {
                    marksScore: { increment: newMark },
                    marksAmount: { increment: 1 }
                }
            })
            return {
                marksScore: movieFromDB.marksScore,
                marksAmount: movieFromDB.marksAmount,
                mark: markDBtoMark(newMarkDB)
            }
        }
    }

    deleteMovieMark = async (
        movieId: number,
        userId: number
    ): Promise<void> => {
        try {
            const mark = await db.mark.delete({
                where: { movieId_userId: { movieId: movieId, userId: userId } }
            })
            await db.movie.update({
                where: { id: movieId },
                data: {
                    marksScore: { increment: -mark.value },
                    marksAmount: { increment: -1 }
                }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError)
                if (error.code === 'P2025')
                    console.log(`mark for movie: ${movieId} with userId: 
                                ${userId} not found`)
        }
    }

    getPerson = async (id: number): Promise<Person> => {
        const res = await db.person.findUnique({
            where: { id: id }
        })
        if (!res) throw new NotFound(`Person with id: ${id} not found`)
        return res
    }

    getPersonRelatedMovies = async (
        id: number
    ): Promise<MovieAndRelation[]> => {
        const res = await db.moviePerson.findMany({
            where: { personId: id },
            select: {
                relation: true,
                movie: {
                    include: {
                        genres: {
                            select: { genre: { select: { value: true } } }
                        }
                    }
                }
            }
        })
        return res.map((val) => {
            let relationValue = Relation.Undefined
            switch (val.relation) {
                case 'ACTOR':
                    relationValue = Relation.Actor
                    break
                case 'Director':
                    relationValue = Relation.Director
                    break
            }
            return {
                movie: plainToMoviesBrief(val.movie),
                relation: relationValue
            }
        })
    }
}
