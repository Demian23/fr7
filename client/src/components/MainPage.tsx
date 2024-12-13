import { useAsyncData } from '../helpers/hooks'
import MovieList from './movie/MovieList'
import MovieDetailed from './movie/MovieDetailed'
import PersonPage from './person/PersonPage'
import ErrorPage from './common/ErrorPage'
import LoadingSpinner from './common/LoadingSpinner'
import NavBar from './NavBar'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import styles from './MainPage.module.css'
import { retriveMoviesBrief } from '../helpers/retrive'
import AdminRoute from './auth/AdminRoute'
import AdminChatWrapper from './admin/AdminChatWrapper'
import { UserProvider } from '../contexts/UserContext'

import React, { useCallback } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from 'react-router-dom'

const MainPageContent: React.FC = () => {
    const { accessToken, setAccessToken } = useAuth()

    const { data, loading, error } = useAsyncData(retriveMoviesBrief)

    const handleSignOut = useCallback(() => {
        setAccessToken(null)
    }, [])

    if (loading) return <LoadingSpinner />
    if (error)
        return <ErrorPage code={error.statusCode} message={error.message} />

    return (
        <div className={styles.mainContainer}>
            <NavBar isLoggedIn={!!accessToken} onSignOut={handleSignOut} />
            <main className={styles.content}>
                <Routes>
                    <Route
                        path="/signin"
                        element={accessToken ? <Navigate to="/" /> : <SignIn />}
                    />
                    <Route
                        path="/signup"
                        element={accessToken ? <Navigate to="/" /> : <SignUp />}
                    />
                    <Route
                        path="/"
                        element={data ? <MovieList movies={data} /> : <></>}
                    />
                    <Route path="/movie/:id" element={<MovieDetailed />} />
                    <Route path="/person/:id" element={<PersonPage />} />
                    <Route
                        path="/error"
                        element={<ErrorPage message="An error occurred" />}
                    />
                </Routes>
            </main>
            {accessToken && (
                <AdminRoute>
                    <AdminChatWrapper />
                </AdminRoute>
            )}
        </div>
    )
}

const MainPage: React.FC = () => {
    return (
        <AuthProvider>
            <UserProvider>
                <Router>
                    <MainPageContent />
                </Router>
            </UserProvider>
        </AuthProvider>
    )
}

export default MainPage
