class ValidationError extends Error {
    constructor({message, httpStatusCode}) {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}

const ERROR_TYPES = {
    USER_CREATION_MISSING_DATA: { message: "Missing payload data in user creation", httpStatusCode: 400 },
    USER_CREATION_INVALID_DATA: { message: "Invalid payload data in user creation", httpStatusCode: 400 },
    USER_CREATION_INVALID_USERNAME: { message: "Invalid username in user creation", httpStatusCode: 400 },
    USER_CREATION_DUPLICATE_ENTRY: { message: "Username is already used in user creation", httpStatusCode: 400 }
}

module.exports = { ValidationError, ERROR_TYPES };