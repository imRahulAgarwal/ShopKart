require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/userRoutes");
const { connectDatabase } = require("./utils/connectDatabase");
const { errorMiddleware } = require("./middlewares/errorMiddleware");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const commonRouter = require("./routes/commonRoutes");
const reportRouter = require("./routes/reportRoutes");
const { PORT, ALLOWED_ORIGINS } = process.env;

const origins = ALLOWED_ORIGINS.split(",").filter((origin) => origin !== " ");
app.use(
    cors({
        origin: origins,
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

connectDatabase();
app.use("/assets", express.static("assets"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", commonRouter);
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reports", reportRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port ${PORT}.`));
