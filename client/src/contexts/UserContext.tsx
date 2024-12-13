import React, { createContext, useState, useContext, ReactNode } from 'react'
import { User } from '../dto/user'

interface UserContextType {
    userInfo: User | null
    setUserInfo: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [userInfo, setUserInfo] = useState<User | null>(null)

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
