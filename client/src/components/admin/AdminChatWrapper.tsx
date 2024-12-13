import React, { useState } from 'react'
import AdminChat from './AdminChat'
import ChatToggle from './ChatToggle'
import styles from './AdminChatWrapper.module.css'
import { useUser } from '../../contexts/UserContext'

const AdminChatWrapper: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false)
    // callback?
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    }

    return (
        <div
            className={`${styles.adminChatWrapper} ${isChatOpen ? styles.open : ''}`}
        >
            <ChatToggle isOpen={isChatOpen} onClick={toggleChat} />
            {isChatOpen && <AdminChat chatName="Admin Chat" />}
        </div>
    )
}

export default AdminChatWrapper
