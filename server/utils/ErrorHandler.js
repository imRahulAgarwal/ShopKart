class ErrorHandler extends Error {
    constructor(message = "Server error", statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { ErrorHandler };
