export default class ApiError extends Error {
    status;
    errors;
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static Unauthorized(message = "User is not authorized") {
        return new ApiError(401, message);
    }

    static BadRequest(errors) {
        return new ApiError(400, "Bad request", errors);
    }
}