import React from 'react'
import MovieListItem from './MovieListItem'
import styles from './MovieList.module.css'
import { MovieBrief } from '../../dto/movie'

interface MovieListProps {
    movies: MovieBrief[]
}

const MovieList: React.FC<MovieListProps> = React.memo(({ movies }) => {
    return (
        <div className={styles.movieList}>
            {movies.map((movie) => (
                <MovieListItem key={movie.id} movie={movie} />
            ))}
        </div>
    )
})

MovieList.displayName = 'MovieList'

export default MovieList
