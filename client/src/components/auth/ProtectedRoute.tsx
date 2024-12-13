import React, { useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAsyncData } from '../../helpers/hooks'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorPage from '../common/ErrorPage'
import api from '../../helpers/api.instance'
import { Fr7Error, Unauthorized } from '../../helpers/errors'
import { RefreshTag } from '../../helpers/retrive'

interface ProtectedRouteProps<T> {
    children: (data: T) => React.ReactNode
    apiCall: (token: string, refresh: boolean) => Promise<T | RefreshTag>
}

function ProtectedRoute<T>({ children, apiCall }: ProtectedRouteProps<T>) {
    const { accessToken, setAccessToken } = useAuth()

    const retriveWithAuth = useCallback(async (): Promise<T> => {
        const data = await apiCall(accessToken || '', true)
        if (data === RefreshTag) {
            const refreshResponse = await fetch(api.user() + api.refresh(), {
                method: 'POST',
                credentials: 'include'
            })
            if (refreshResponse.ok) {
                const { accessToken: newAccess } = await refreshResponse.json()
                setAccessToken(newAccess)
                return (await apiCall(newAccess, false)) as T
            } else {
                setAccessToken(null)
                throw new Unauthorized()
            }
        }
        return data as T
    }, [apiCall, accessToken, api])

    const { data, loading, error } = useAsyncData(retriveWithAuth)

    if (loading) return <LoadingSpinner />
    if (!accessToken) return <Navigate to="/signin" />
    if (error)
        return error instanceof Fr7Error ? (
            <ErrorPage code={error.statusCode} message={error.message} />
        ) : (
            <ErrorPage message={error} />
        )

    return <>{children(data as T)}</>
}

export default ProtectedRoute
