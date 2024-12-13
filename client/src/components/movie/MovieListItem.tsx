import React, { useState, useMemo } from 'react'
import styles from './MovieListItem.module.css'
import { MovieBrief } from '../../dto/movie'
import { useNavigate } from 'react-router-dom'
import { getMarkColor } from '../../helpers/domain'

const MovieListItem: React.FC<{ movie: MovieBrief }> = React.memo(
    ({ movie }) => {
        const [showTooltip, setShowTooltip] = useState(false)
        const navigate = useNavigate()

        const avgMark = useMemo(() => {
            return movie.marksAmount > 0
                ? (movie.marksScore / movie.marksAmount).toFixed(1)
                : '-'
        }, [movie.marksAmount, movie.marksScore])

        const yearFormatter = useMemo(
            () => new Intl.DateTimeFormat('en', { year: 'numeric' }),
            []
        )
        const releaseYear = useMemo(
            () => yearFormatter.format(new Date(movie.launch)),
            [yearFormatter, movie.launch]
        )

        const handleClick = () => {
            navigate(`/movie/${movie.id}`)
        }

        return (
            <div className={styles.movieItem} onClick={handleClick}>
                <div className={styles.leftPart}>
                    <div
                        className={`${styles.markContainer} ${getMarkColor(avgMark)}`}
                        aria-label={`Average rating: ${avgMark}`}
                    >
                        <p
                            className={styles.avgMark}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            {avgMark}
                        </p>
                        {showTooltip && (
                            <div className={styles.tooltip}>
                                Votes: {movie.marksAmount}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.centerPart}>
                    <h2 className={styles.titleRu}>{movie.title_ru}</h2>
                    <h3 className={styles.titleOrigin}>{movie.title_origin}</h3>
                    <p className={styles.genres}>{movie.genres.join(', ')}</p>
                </div>
                <div className={styles.rightPart}>
                    <div className={styles.yearDurationWrapper}>
                        <p className={styles.year}>{releaseYear}</p>
                        <p className={styles.duration}>{movie.duration} min</p>
                    </div>
                </div>
            </div>
        )
    }
)

MovieListItem.displayName = 'MovieListItem'

export default MovieListItem
