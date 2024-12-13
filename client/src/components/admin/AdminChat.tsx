import { Message, ChatEvents } from '../../helpers/chat'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './AdminChat.module.css'
import { io, Socket } from 'socket.io-client'
import { useUser } from '../../contexts/UserContext'

const events = new ChatEvents()

interface AdminChatProps {
    chatName?: string
}

const AdminChat: React.FC<AdminChatProps> = ({ chatName }) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const socketRef = useRef<Socket | null>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const { userInfo } = useUser()

    useEffect(() => {
        socketRef.current = io({
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        })

        socketRef.current.on(events.connect(), () => {
            socketRef.current!.emit(events.register(), userInfo)
        })

        socketRef.current.on(events.msg(), (message: [Message]) => {
            setMessages((prevMessages) => [...prevMessages, ...message])
        })

        socketRef.current.on(events.announce(), (message: string) => {
            const msg: Message = {
                user: { login: '', email: '' },
                timestamp: new Date().toISOString(),
                message: message
            }
            setMessages((prevMessages) => [...prevMessages, msg])
        })

        return () => {
            if (socketRef.current) socketRef.current.disconnect()
        }
    }, [userInfo])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            if (inputMessage.trim() && socketRef.current) {
                const msg: Message = {
                    user: { login: userInfo!.login, email: userInfo!.email },
                    timestamp: new Date().toISOString(),
                    message: inputMessage
                }
                socketRef.current.emit(events.msg(), msg)
                setInputMessage('')
            }
        },
        [userInfo, inputMessage]
    )

    const getMessageStyle = useCallback(
        (message: Message) => {
            const isCurrentUser = message.user.email === userInfo!.email
            const isAnnounce = message.user.email === ''

            if (isCurrentUser) return styles.currentUserMessage
            else if (isAnnounce) return styles.announceMessage
            return styles.otherMessage
        },
        [userInfo]
    )

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h3 className={styles.chatName}>{chatName}</h3>
            </div>
            <div className={styles.chatMessages} ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`${styles.message} ${getMessageStyle(message)}`}
                    >
                        {message.user.email && (
                            <div className={styles.messageHeader}>
                                <span className={styles.sender}>
                                    {message.user.login}
                                </span>
                                <span
                                    className={styles.timestamp}
                                    title={new Date(
                                        message.timestamp
                                    ).toLocaleString()}
                                >
                                    {new Date(
                                        message.timestamp
                                    ).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        )}
                        <p className={styles.messageText}>{message.message}</p>
                        {message.user.email && (
                            <span className={styles.userEmail}>
                                {message.user.email}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className={styles.chatForm}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.chatInput}
                />
                <button type="submit" className={styles.chatButton}>
                    Send
                </button>
            </form>
        </div>
    )
}

export default AdminChat
