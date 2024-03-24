class ValidationError extends Error {
    constructor({message, httpStatusCode}) {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}

class DatabaseError extends Error {
    constructor({message, httpStatusCode}) {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}

class AuthenticationError extends Error {
    constructor({message, httpStatusCode}) {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}

class PubSubError extends Error {
    constructor({message, httpStatusCode}) {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}

const VALIDATION_ERROR_TYPES = {
    USER_CREATION_MISSING_DATA: { message: "Missing payload data in user creation", httpStatusCode: 400 },
    USER_CREATION_INVALID_DATA: { message: "Invalid payload data in user creation", httpStatusCode: 400 },
    USER_CREATION_INVALID_USERNAME: { message: "Invalid username in user creation", httpStatusCode: 400 },

    USER_UPDATE_MISSING_DATA: { message: "Missing payload data in user update", httpStatusCode: 400 },
    USER_UPDATE_INVALID_DATA: { message: "Invalid payload data in user update", httpStatusCode: 400 },

    USER_ACTIVATE_ALREADY_ACTIVATED: { message: "The user is already activated", httpStatusCode: 400 },
    USER_ACTIVATE_LINK_EXPIRED: { message: "The link has expired", httpStatusCode: 410 },
    USER_ACTIVATE_INVALID_LINK: { message: "User does not exist for this link", httpStatusCode: 400 },
    USER_ACTIVATE_TEST_USER: { message: "The user is a test user", httpStatusCode: 400 },
}

const DATABASE_ERROR_TYPES = {
    USER_CREATION_DUPLICATE_ENTRY: { message: "Username is already used in user creation", httpStatusCode: 400 },
    DATABASE_CONNECTION_REFUSED: { message: "Database Connection is refused", httpStatusCode: 503 }
}

const AUTHENTICATION_ERROR_TYPES = {
    AUTHENTICATION_UNAUTHORIZED: { message: "Invalid Basic Token", httpStatusCode: 401 }
}

const PUB_SUB_ERROR_TYPES = {
    PUBLISHING_FAILURE : { message: "Message Publishing Failed", httpStatusCode: 503 }
} 

module.exports = { ValidationError, DatabaseError, AuthenticationError, PubSubError, VALIDATION_ERROR_TYPES, DATABASE_ERROR_TYPES, AUTHENTICATION_ERROR_TYPES, PUB_SUB_ERROR_TYPES };