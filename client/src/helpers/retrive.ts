import { MovieDetailedAndUserMark } from '../dto/combination'
import api from './api.instance'
import { Fr7Error, Unauthorized } from './errors'
import { User } from '../dto/user'

class RefreshTag {}

async function retriveMoviesBrief() {
    const res = await fetch(api.movies())
    if (res.ok) {
        const obj = await res.json()
        return Object.values(obj)
    } else {
        const msg = await res.text()
        throw new Fr7Error(msg, res.status)
    }
}

async function submitMovieMark(
    movieId: string,
    mark: number,
    token: string
): Promise<Response> {
    const response = await fetch(
        api.movies() + api.byId(movieId) + api.mark(),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ newMark: mark })
        }
    )
    return response
}

async function deleteMovieMark(id: string, token: string) {
    const res = await fetch(
        api.movies() + api.byId(id) + api.mark() + api.delete(),
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res
}

async function retrivePersonDetailed(id: string) {
    const res = await fetch(api.movies() + api.person() + api.byId(id))
    if (res.ok) {
        return await res.json()
    } else {
        const msg = await res.text()
        throw new Fr7Error(msg, res.status)
    }
}

async function getMovieDetailed(id: string, token: string) {
    return await fetch(api.movies() + api.byId(id), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

async function getUserInfo(token: string) {
    return await fetch(api.user() + api.info(), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

async function handleRefresh<T>(
    refresh: boolean,
    res: Response
): Promise<T | RefreshTag> {
    if (res.ok) {
        return res.json() as T
    } else {
        if (refresh && res.status === Unauthorized.code) return RefreshTag
        else {
            const msg = await res.text()
            throw new Fr7Error(msg, res.status)
        }
    }
}

async function retriveMovieDetailed(
    id: string,
    token: string,
    refresh: boolean
): Promise<MovieDetailedAndUserMark | RefreshTag> {
    return handleRefresh<MovieDetailedAndUserMark>(
        refresh,
        await getMovieDetailed(id, token)
    )
}

async function retriveUserInfo(
    token: string,
    refresh: boolean
): Promise<User | RefreshTag> {
    return handleRefresh<User>(refresh, await getUserInfo(token))
}

export {
    retriveMoviesBrief,
    retriveMovieDetailed,
    submitMovieMark,
    deleteMovieMark,
    retrivePersonDetailed,
    retriveUserInfo,
    RefreshTag
}
