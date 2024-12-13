import React from 'react'
import styles from './ChatToggle.module.css'
import { MessageCircle, X } from 'lucide-react'

interface ChatToggleProps {
    isOpen: boolean
    onClick: () => void
}

const ChatToggle: React.FC<ChatToggleProps> = ({ isOpen, onClick }) => {
    return (
        <button
            className={`${styles.chatToggle} ${isOpen ? styles.open : ''}`}
            onClick={onClick}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
    )
}

export default ChatToggle
