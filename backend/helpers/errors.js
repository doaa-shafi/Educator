class ServerError extends Error{
    constructor(message){
        super(message)
        this.statusCode=500
    }
}

class ConflictError extends Error{
    constructor(message){
        super(message)
        this.statusCode=409
    }
}

class ValidationError extends Error{
    constructor(message){
        super(message)
        this.statusCode=400
    }
}
class AuthenticationError extends Error{
    constructor(message){
        super(message)
        this.statusCode=401
    }
}
class AuthorizationError extends Error{
    constructor(message){
        super(message)
        this.statusCode=403
    }
}

module.exports={
    ServerError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    ConflictError,
}