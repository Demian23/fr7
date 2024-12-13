import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAsyncData } from '../../helpers/hooks'
import ErrorPage from '../common/ErrorPage'
import LoadingSpinner from '../common/LoadingSpinner'
import styles from './PersonPage.module.css'
import MovieRelationItem from './MovieRelationItem'
import { PersonAndMovies } from '../../dto/combination'
import { retrivePersonDetailed } from '../../helpers/retrive'

const PersonPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const getPerson = useCallback(async () => {
        return await retrivePersonDetailed(id!)
    }, [id])

    const { data, loading, error } = useAsyncData(getPerson)

    if (loading) return <LoadingSpinner />
    if (error)
        return <ErrorPage code={error.statusCode} message={error.message} />

    if (data) {
        const { person, moviesAndRelations } = data! as PersonAndMovies
        return (
            <div className={styles.personPage}>
                <h1 className={styles.personName}>{person.name}</h1>
                <div className={styles.movieList}>
                    {moviesAndRelations.map((movieAndRelation) => (
                        <MovieRelationItem
                            key={movieAndRelation.movie.id}
                            movie={movieAndRelation.movie}
                            relation={movieAndRelation.relation}
                        />
                    ))}
                </div>
            </div>
        )
    } else return <></>
}

export default PersonPage
