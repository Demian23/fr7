import { Mark } from './mark'
import { MovieBrief } from './movie'

export interface Person {
    id: number
    name: string
}
export enum Relation {
    Undefined,
    Actor,
    Director
}

export interface MovieDetailed {
    movie: MovieBrief
    countries: string[]
    directors: Person[]
    actors: Person[]
    descriptions: string[]
}

export interface MovieDetailedAndUserMark {
    detailed: MovieDetailed
    mark: Mark | null
}

export interface MovieAndRelation {
    movie: MovieBrief
    relation: Relation
}

export interface PersonAndMovies {
    person: Person
    moviesAndRelations: MovieAndRelation[]
}
