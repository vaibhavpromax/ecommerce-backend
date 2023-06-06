// Utils
const logger = require('../../utils/logger');
const redisClient = require('./connect');

// Helpers and Services
const getTTL = require('./getTTL');

const setWithExpiry = async (key, value, expiryTime) => {
  try {
    const [ttl, ttlErr] = await getTTL(key);
    if (!(ttl > 0) || ttlErr) {
      await redisClient.set(key, value);
      await redisClient.expire(key, expiryTime);
      // logger.info(`Redis set with expiry: ${expiryTime} seconds`);
    } else {
      // Retaining the existing TTL
    }
    return [true, null];
  } catch (err) {
    logger.error(`Redis set with expiry error: ${err.message}`);
    return [null, err.message];
  }
};

module.exports = setWithExpiry;
