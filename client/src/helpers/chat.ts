export interface UserData {
    login: string
    email: string
}

export interface Message {
    // TODO not secure. But no latency on obtaining user info by server on new msg
    user: UserData
    // TODO timestamp of arriving to server or outgoing from client?
    timestamp: string
    message: string
}

export class ChatEvents {
    connect = function () {
        return 'connect'
    }

    disconnect = function () {
        return 'disconnect'
    }

    msg = function () {
        return 'message'
    }

    broadcast = function () {
        return 'broadcast'
    }

    register = function () {
        return 'register'
    }

    announce = function () {
        return 'announcement'
    }
}
