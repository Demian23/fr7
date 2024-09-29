class Fr7Error extends Error{
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFound extends Fr7Error {
    constructor(message: string = 'Not Found') {
        super(message, 404);
    }
}

class Data extends Fr7Error {
    constructor(message: string = 'Database Error') {
        super(message, 500);
    }
}

export {Fr7Error, NotFound, Data};
