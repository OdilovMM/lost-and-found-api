require("dotenv").config();
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
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authRouter = require("./routes/authRoutes.js");
const itemRouter = require("./routes/itemRoutes.js");
const userRouter = require("./routes/userRoutes.js");
// const claimRouter = require("./routes/claimRoutes.js");

app.use(express.static("./public"));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET || "defaultSecret"));

app.enable("trust proxy");

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
    origin: ["http://localhost:5173", "https://lost-and-found-zeta.vercel.app"],
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
app.get("/api/v1/test", (req, res) => {
  res.send("Rest-API is working");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/user", userRouter);
// app.use("/api/v1/claims", claimRouter);

// Global Errors
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
