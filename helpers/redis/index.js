const setValue = require('./create');
const getValue = require('./get');
const removeValue = require('./remove');
const setWithExpiry = require('./setWithExpiry');
const getTTL = require('./getTTL');

const redisHelper = {
  setValue,
  getValue,
  removeValue,
  setWithExpiry,
  getTTL,
};

module.exports = redisHelper;
