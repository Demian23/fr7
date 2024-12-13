import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MovieAndRelation } from '../../dto/combination'
import styles from './MovieRelationItem.module.css'
import { getMarkColor } from '../../helpers/domain'

const MovieRelationItem: React.FC<MovieAndRelation> = ({ movie, relation }) => {
    const [showTooltip, setShowTooltip] = useState(false)
    const relationText = relation === 1 ? 'Actor' : 'Director'
    const relationClass =
        relation === 1 ? styles.actorRelation : styles.directorRelation

    const avgMark =
        movie.marksAmount > 0
            ? (movie.marksScore / movie.marksAmount).toFixed(1)
            : '-'

    const markColorClass = getMarkColor(avgMark, false)

    return (
        <div className={styles.movieRelationItem}>
            <Link to={`/movie/${movie.id}`} className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title_ru}</h3>
                {movie.title_origin && (
                    <h4 className={styles.movieOriginalTitle}>
                        {movie.title_origin}
                    </h4>
                )}
                <p className={styles.movieYear}>
                    {new Date(movie.launch).getFullYear()}
                </p>
            </Link>
            <div className={styles.rightColumn}>
                <div className={`${styles.relation} ${relationClass}`}>
                    {relationText}
                </div>
                <div
                    className={`${styles.mark} ${markColorClass}`}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {avgMark}
                    {showTooltip && (
                        <div className={styles.tooltip}>
                            Votes: {movie.marksAmount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MovieRelationItem
