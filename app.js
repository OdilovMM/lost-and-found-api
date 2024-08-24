require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

// error handler imports
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRouter = require("./routes/authRoutes.js");
const itemRouter = require("./routes/itemRoutes.js");
const claimRouter = require("./routes/claimRoutes.js");
const userRouter = require("./routes/userRoutes.js");

app.use(express.static("./public"));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));

app.set("trust proxy", 1);

// Limit requests from same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use("/api", limiter);
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(mongoSanitize());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Test Routes
app.get("/api/v1/test-api", (req, res) => {
  res.send("Rest-API is working");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/claims", claimRouter);
app.use("/api/v1/user", userRouter);

// Global Errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
