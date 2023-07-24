// Utils
const logger = require('../../utils/logger');
const redisClient = require('./connect');

const getTTL = async (key) => {
  try {
    const ttl = await redisClient.ttl(key);
    // logger.info(`Redis get ttl: ${ttl}`);
    return [ttl, null];
  } catch (err) {
    logger.error(`Redis get ttl error: ${err.message}`);
    return [null, err.message];
  }
};

module.exports = getTTL;
