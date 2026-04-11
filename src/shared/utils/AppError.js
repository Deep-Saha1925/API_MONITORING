class AppError extends Error{
    constructor(message, statuscode = 500, errors = null){
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;