// Utils

const logger = require('../../utils/logger');
const redisClient = require('./connect');

const setValue = async (key, value) => {
  try {
    await redisClient.set(key, value);
    // logger.info(`Redis set value: ${result}`);
    return [true, null];
  } catch (err) {
    logger.error(`Redis set error: ${err.message}`);
    return [null, err.message];
  }
};

//setValue('added-user-ids-for-mail', JSON.stringify(['1', '2']));

module.exports = setValue;
