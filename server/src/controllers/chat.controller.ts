import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { ChatEvents, Message, UserData } from '../common/chat'

const chatEvents = new ChatEvents()

export default class Chat {
    // TODO create different namespaces for different chats

    private io: Server
    private msgs: Message[]
    // key -> socketId
    private connectedUsers: Map<string, UserData>

    constructor(server: HttpServer) {
        this.io = new Server(server)
        this.msgs = []
        this.connectedUsers = new Map<string, UserData>()
    }

    start() {
        this.setupSocketHandlers()
    }

    setupSocketHandlers() {
        this.io.on(chatEvents.connect(), (socket: Socket) => {
            // TODO add normal logging system
            socket.on(chatEvents.msg(), (message: Message) => {
                this.msgs.push(message)
                this.io.emit(chatEvents.msg(), [message])
            })

            // TODO no security at all
            socket.on(chatEvents.register(), (user: UserData) => {
                this.connectedUsers.set(socket.id, user)
                if (this.msgs.length > 0)
                    socket.emit(chatEvents.msg(), this.msgs)
                socket.broadcast.emit(
                    chatEvents.announce(),
                    `${user.login} (${user.email}) arrived`
                )
            })

            socket.on(chatEvents.disconnect(), () => {
                const user = this.connectedUsers.get(socket.id)
                socket.broadcast.emit(
                    chatEvents.announce(),
                    `${user?.login} (${user?.email}) leaved`
                )
                this.connectedUsers.delete(socket.id)
            })
        })
    }
}
