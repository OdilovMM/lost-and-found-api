const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "Server.js" });

process.on("uncaughtException", (err) => {
  log.error("UNCAUGHT EXCEPTION! Shutting down");
  log.error(err);
  log.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });
const app = require("./app");

mongoose
  .connect(process.env.DB_HOME, {})
  .then(() => log.info("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  log.info(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  log.error("UNHANDLED REJECTION! Shutting down");
  log.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
