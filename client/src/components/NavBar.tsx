import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NavBar.module.css'

interface NavBarProps {
    isLoggedIn: boolean
    onSignOut: () => void
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, onSignOut }) => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <Link to="/" className={styles.navLink}>
                    Home
                </Link>
            </div>
            <div className={styles.centerSection}>
                <h1 className={styles.projectName}>Film Rate</h1>
            </div>
            <div className={styles.rightSection}>
                {isLoggedIn ? (
                    <button onClick={onSignOut} className={styles.navButton}>
                        Sign Out
                    </button>
                ) : (
                    <>
                        <Link to="/signin" className={styles.navButton}>
                            Sign In
                        </Link>
                        <Link to="/signup" className={styles.navButton}>
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default NavBar
