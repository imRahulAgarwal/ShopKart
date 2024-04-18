const { connect } = require("mongoose");
const User = require("../models/userModel");
const { MONGO_URL, NAME, EMAIL, PASSWORD } = process.env;

const connectDatabase = async () => {
    try {
        await connect(MONGO_URL);
        console.log("Database Connected✅");
        const userCreated = await User.findOne({ email: EMAIL });
        if (!userCreated)
            await User.create({
                name: NAME,
                email: EMAIL,
                password: PASSWORD,
                isAdmin: true,
                number: "9843186988",
            });
    } catch (error) {
        console.log(`Error connecting database : ${error.message}`);
    }
};

module.exports = { connectDatabase };
