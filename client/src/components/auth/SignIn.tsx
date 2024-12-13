import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ErrorPage from '../common/ErrorPage'
import styles from './Auth.module.css'
import api from '../../helpers/api.instance'
import { UserSignIn } from '../../dto/user'

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { setAccessToken } = useAuth()
    const navigate = useNavigate()

    // TODO rewrite this code
    const handleSignIn = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            const userSignIn: UserSignIn = { email: email, password: password }
            try {
                const response = await fetch(api.user() + api.login(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userSignIn)
                })
                if (response.ok) {
                    const { accessToken } = await response.json()
                    setAccessToken(accessToken)
                    navigate('/')
                } else {
                    const message = await response.text()
                    setError(`Code: ${response.status}. ${message}`)
                }
            } catch (error: any) {
                setError(error.message)
            }
        },
        [email, password, setAccessToken, navigate]
    )

    if (error) {
        return <ErrorPage message={error} />
    }

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.authTitle}>Sign In</h2>
            <form onSubmit={handleSignIn} className={styles.authForm}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Sign In
                </button>
            </form>
        </div>
    )
}

export default SignIn
