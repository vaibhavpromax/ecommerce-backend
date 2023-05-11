require("dotenv").config();
const { sequelize } = require("./db/models");
const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const logger = require("./utils/logger");
const port = process.env.PORT || 8080;
const { NODE_ENV } = process.env;

server.listen(port, () =>
  logger.info(
    `[BACKEND-MICROSERVICE (http) LISTENING ON PORT:${port} ENV:${NODE_ENV}]`
  )
);
sequelize
  .sync()
  .then(() => {
    logger.info("[CONNECTED TO DATABASE]");
  })
  .catch((err) => {
    logger.error("Failed to connect to db", err);
  });
