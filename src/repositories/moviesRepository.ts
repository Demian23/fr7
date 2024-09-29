import { NotFound } from '../errors/Fr7Errors.js';
import { PrismaClient } from '@prisma/client';

export class MoviesRepository{
    
    private prisma = new PrismaClient();

    getMoviesBriefOrderedByLaunc = async () => {
        // TODO handle exception PrismaClientKnownRequestError
        return await this.prisma.movie.findMany({
            orderBy:[{launch: 'desc'}],
            include: {
                genres: {
                    select: {
                       genre:{ select:{ value: true } }
                    }
                },
            },
        });
    }

    getMovieDetailed = async (movieId: number, userId: number) => {
            // TODO handle exception PrismaClientKnownRequestError
            const movie = await this.prisma.movie.findUnique({
                where: { id: movieId },
                include: {
                    genres: { include: { genre:{ select: { value: true } }, }, },
                    countries: { include: { country: { select: { value: true }, }, }, },
                    marks: { 
                        where: { userId: userId },
                    },
                },
            });
            return movie;

    }


    // return marksScore and marksAmount
    // usage for caches
    setOrUpdateMovieMark = 
        async (movieId: number, userId: number, mark: number) : Promise<[marksScore: number, marksAmount: number]> => {
            const currentMark = await this.prisma.mark.findUnique(
                {where: {movieId_userId: {movieId: movieId, userId: userId} } }
            );

            if(currentMark){
                const updateScoreOn = mark - currentMark.value;
                await this.prisma.mark.update({
                    where: {
                        movieId_userId: {
                            movieId: currentMark.movieId, 
                            userId: currentMark.userId
                        }
                    },
                    data: {value: mark}
                }); 
                const updatedMovie = await this.prisma.movie.update({
                    where: {id: movieId},
                    data: { marksScore: {increment: updateScoreOn}}
                });
                return [updatedMovie.marksScore, updatedMovie.marksAmount];
            } else {
                // TODO add @updateAt in scheme?
                await this.prisma.mark.create({
                    data: {
                        value: mark,
                        movie: {
                            connect: {id: movieId}
                        },
                        user: {
                            connect: {id: userId}
                        },
                    }
                });

                const updatedMovie = await this.prisma.movie.update({
                    where: {id: movieId},
                    data: { 
                        marksScore: {increment: mark},
                        marksAmount: {increment: 1},
                    }
                });

                return [updatedMovie.marksScore, updatedMovie.marksAmount];
            }
        }
}

