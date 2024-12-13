import ProtectedRoute from '../auth/ProtectedRoute'
import {
    deleteMovieMark,
    retriveMovieDetailed,
    submitMovieMark
} from '../../helpers/retrive'
import styles from './MovieDetailed.module.css'
import { MovieDetailedAndUserMark } from '../../dto/combination'
import ErrorPage from '../common/ErrorPage'
import { useAuth } from '../../contexts/AuthContext'
import { getMarkColor } from '../../helpers/domain'

import React, { useCallback, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

interface MovieDetailedContentProps {
    data: MovieDetailedAndUserMark
    onMarkSubmit: (mark: number) => void
    onMarkDelete: () => void
}

const MovieDetailedContent: React.FC<MovieDetailedContentProps> = ({
    data,
    onMarkSubmit,
    onMarkDelete
}) => {
    const { detailed, mark } = data
    const { movie, countries, directors, actors, descriptions } = detailed
    const [userMark, setUserMark] = useState<number>(mark ? mark.value : 0)

    const avgMark =
        movie.marksAmount > 0
            ? (movie.marksScore / movie.marksAmount).toFixed(1)
            : '-'

    const handleMarkSubmit = () => {
        onMarkSubmit(userMark)
    }

    return (
        <div className={styles.movieDetailed}>
            <div className={styles.header}>
                <h1 className={styles.titleRu}>{movie.title_ru}</h1>
                <span
                    className={`${styles.avgMark} ${getMarkColor(avgMark, false)}`}
                >
                    {avgMark}
                </span>
            </div>
            {movie.title_origin && (
                <h2 className={styles.titleOrigin}>{movie.title_origin}</h2>
            )}

            <div className={styles.content}>
                <div className={styles.leftColumn}>
                    <div className={styles.info}>
                        <p className={styles.genres}>
                            Genres: {movie.genres.join(', ')}
                        </p>
                        <p className={styles.countries}>
                            Countries:{' '}
                            {countries
                                .map(
                                    (country) =>
                                        country.charAt(0).toUpperCase() +
                                        country.slice(1)
                                )
                                .join(', ')}
                        </p>
                        <p className={styles.launchDuration}>
                            <span>
                                Launch: {new Date(movie.launch).getFullYear()}
                            </span>
                            <span>Duration: {movie.duration} minutes</span>
                        </p>
                    </div>

                    <div className={styles.userMark}>
                        <h3>Your Mark</h3>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={userMark}
                            onChange={(e) =>
                                setUserMark(Number(e.target.value))
                            }
                            className={styles.markInput}
                        />
                        <span className={styles.markValue}>{userMark}</span>
                        <button
                            onClick={handleMarkSubmit}
                            className={styles.markButton}
                        >
                            Submit Mark
                        </button>
                        <button
                            onClick={onMarkDelete}
                            className={styles.markButton}
                            disabled={!mark}
                        >
                            Delete Mark
                        </button>
                        {mark && (
                            <div className={styles.markDates}>
                                <p>
                                    Assigned:{' '}
                                    {new Date(mark.assignedAt).toLocaleString()}
                                </p>
                                <p>
                                    Updated:{' '}
                                    {new Date(mark.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.personList}>
                        <h3>Directors</h3>
                        <ul>
                            {directors.map((director) => (
                                <li key={director.id}>
                                    <Link to={`/person/${director.id}`}>
                                        {director.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.personList}>
                        <h3>Actors</h3>
                        <ul>
                            {actors.map((actor) => (
                                <li key={actor.id}>
                                    <Link to={`/person/${actor.id}`}>
                                        {actor.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.descriptions}>
                <h3>Descriptions</h3>
                {descriptions.map((description, index) => (
                    <p key={index}>{description}</p>
                ))}
            </div>
        </div>
    )
}

const MovieDetailed: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [error, setError] = useState<string | null>(null)
    const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)
    const { accessToken } = useAuth()

    const fetchMovieDetails = useCallback(
        async (token: string, refresh: boolean) => {
            return await retriveMovieDetailed(id!, token, refresh)
        },
        [id]
    )

    const handleMarkSubmit = useCallback(
        async (token: string, mark: number) => {
            const response = await submitMovieMark(id!, mark, token)
            if (response.ok) {
                setShouldRefetch(true)
            } else {
                setError(`Failed to submit mark: ${response.status}`)
            }
        },
        [id]
    )

    const handleMarkDelete = useCallback(
        async (token: string) => {
            const response = await deleteMovieMark(id!, token)
            if (response.ok || response.status === 204) {
                setShouldRefetch(true)
            } else {
                setError(`Failed to submit mark: ${response.status}`)
            }
        },
        [id]
    )
    if (error) {
        return <ErrorPage message={error} />
    }

    return (
        <ProtectedRoute<MovieDetailedAndUserMark>
            apiCall={fetchMovieDetails}
            key={shouldRefetch ? 'refetch' : 'initial'}
        >
            {(movieData) => (
                <MovieDetailedContent
                    data={movieData}
                    onMarkSubmit={(mark) => {
                        handleMarkSubmit(accessToken!, mark)
                        setShouldRefetch(false)
                    }}
                    onMarkDelete={() => {
                        handleMarkDelete(accessToken!)
                        setShouldRefetch(false)
                    }}
                />
            )}
        </ProtectedRoute>
    )
}

export default MovieDetailed
