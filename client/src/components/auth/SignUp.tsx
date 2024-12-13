import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ErrorPage from '../common/ErrorPage'
import styles from './Auth.module.css'
import api from '../../helpers/api.instance'
import { UserSignUp } from '../../dto/user'

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { setAccessToken } = useAuth()
    const navigate = useNavigate()

    const handleSignUp = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            try {
                // TODO Check that fields are not empty
                const newUser: UserSignUp = {
                    login: login,
                    email: email,
                    password: password
                }
                const response = await fetch(api.user() + api.create(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                })
                if (response.ok) {
                    const data = await response.json()
                    setAccessToken(data.accessToken)
                    navigate('/')
                } else {
                    const message = await response.text()
                    setError(`Code: ${response.status}. ${message}`)
                }
            } catch (error: any) {
                setError(error.message)
            }
        },
        [email, login, password, setAccessToken, navigate]
    )

    if (error) {
        return <ErrorPage message={error} />
    }

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.authTitle}>Sign Up</h2>
            <form onSubmit={handleSignUp} className={styles.authForm}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.authInput}
                    required
                />
                <input
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className={styles.authInput}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.authInput}
                    required
                />
                <button type="submit" className={styles.authButton}>
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignUp
