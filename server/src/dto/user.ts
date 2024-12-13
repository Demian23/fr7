export enum Role {
    user,
    admin
}

export interface User {
    id: number
    login: string
    email: string
    role: Role
}

export interface UserSignUp {
    login: string
    email: string
    password: string
}

export interface UserSignIn {
    email: string
    password: string
}

// TODO add constraints on login, email password in db, client, server
