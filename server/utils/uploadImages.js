const multer = require("multer");

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid image type. Only JPG and PNG images are allowed."));
    }
};
const limits = { fileSize: 1024 * 1024 * 2 };
const upload = multer({ storage: multer.memoryStorage(), limits, fileFilter });

module.exports = upload;
