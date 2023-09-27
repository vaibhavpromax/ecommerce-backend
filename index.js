require("dotenv").config();
const { sequelize } = require("./db/models");
const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const logger = require("./utils/logger");
const port = process.env.PORT || 8080;
const { NODE_ENV } = process.env;

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    logger.info("[CONNECTED TO DATABASE]");
    server.listen(port, () =>
      logger.info(
        `[BACKEND-MICROSERVICE (http) LISTENING ON PORT:${port} ENV:${NODE_ENV}]`
      )
    );
  })
  .catch((err) => {
    logger.error("Failed to connect to db", err);
  });
