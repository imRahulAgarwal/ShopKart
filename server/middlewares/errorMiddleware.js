const errorMiddleware = async (error, req, res, next) => {
    if (error.statusCode === "LIMIT_FILE_SIZE") {
        error.message = "Image too large. Provide image less than size 1 MB.";
        error.statusCode = 413;
    }
    if (error.message === "invalid signature") {
        error.message = "Invalid token";
        error.statusCode = 401;
    }
    if (error.message === "jwt malformed") {
        error.message = "Invalid JWT token";
        error.statusCode = 401;
    }
    if (error.message === "jwt expired") {
        error.message = "Token expired";
        error.statusCode = 401;
    }
    if (error.statusCode === 11000) {
        error.message = "E-Mail already exists.";
        error.statusCode = 400;
    }
    if (error.statusCode === "ENOENT") {
        error.message = "File not found";
        error.statusCode = 415;
    }
    if (error.statusCode === "ESOCKET") {
        error.message = "SMTP not connected.";
        error.statusCode = 500;
    }
    res.status(error.statusCode).json({ success: false, message: error.message });
};

module.exports = { errorMiddleware };
