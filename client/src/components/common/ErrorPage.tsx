import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ErrorPage.module.css'

interface ErrorPageProps {
    code?: number
    message: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code, message }) => {
    const navigate = useNavigate()

    return (
        <div className={styles.errorContainer}>
            {code && <h1 className={styles.errorCode}>{code}</h1>}
            <h2 className={styles.errorTitle}>Oops! An error occurred</h2>
            <p className={styles.errorMessage}>{message}</p>
            <button
                className={styles.returnButton}
                onClick={() => navigate('/')}
            >
                Return to Home
            </button>
        </div>
    )
}

export default ErrorPage
