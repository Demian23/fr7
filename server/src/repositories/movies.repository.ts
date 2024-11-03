import { PrismaClient } from '@prisma/client'

export class MoviesRepository {
    private prisma = new PrismaClient()

    getMoviesBriefOrderedByLaunc = async () => {
        return await this.prisma.movie.findMany({
            orderBy: [{ launch: 'desc' }],
            include: {
                genres: {
                    select: {
                        genre: { select: { value: true } }
                    }
                }
            }
        })
    }
}
