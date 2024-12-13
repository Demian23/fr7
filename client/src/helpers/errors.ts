class Fr7Error extends Error {
    public statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

class BadRequest extends Fr7Error {
    static readonly code = 400
    constructor(message: string = 'Bad request') {
        super(message, BadRequest.code)
    }
}

class NotFound extends Fr7Error {
    static readonly code = 404
    constructor(message: string = 'Not Found') {
        super(message, NotFound.code)
    }
}

class ResourceConflict extends Fr7Error {
    static readonly code = 409
    constructor(message: string = 'Resource conflict') {
        super(message, ResourceConflict.code)
    }
}

class InternalError extends Fr7Error {
    static readonly code = 500
    constructor(message: string = 'Internal server error') {
        super(message, InternalError.code)
    }
}

class Unauthorized extends Fr7Error {
    static readonly code = 401
    constructor(message: string = 'Unauthorized') {
        super(message, Unauthorized.code)
    }
}

export {
    Fr7Error,
    NotFound,
    BadRequest,
    ResourceConflict,
    InternalError,
    Unauthorized
}
