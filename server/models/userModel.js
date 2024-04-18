const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../utils/ErrorHandler");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        number: {
            type: String,
            required: true,
        },
        password: String,
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
    },
    { versionKey: false }
);

userSchema.pre("save", async function (next) {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(new ErrorHandler(error));
    }
});

const User = model("users", userSchema);

module.exports = User;
