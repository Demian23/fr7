import React from 'react'
import ProtectedRoute from './ProtectedRoute'
import { retriveUserInfo } from '../../helpers/retrive'
import { useUser } from '../../contexts/UserContext'

interface AdminRouteProps {
    children: React.ReactNode
}

enum Role {
    user,
    admin
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { userInfo, setUserInfo } = useUser()
    return (
        <ProtectedRoute apiCall={retriveUserInfo}>
            {(user) => {
                if (user !== userInfo) setUserInfo(user)
                if (user.role === Role.admin) {
                    return children
                }
                return <></>
            }}
        </ProtectedRoute>
    )
}

export default AdminRoute
