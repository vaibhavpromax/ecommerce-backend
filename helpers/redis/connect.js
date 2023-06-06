require("dotenv").config();

const redis = require('redis');

const client = redis.createClient({
  url: `redis://localhost:${process.env.REDIS_PORT}`,
});

client.connect();

client.on('error', (err) => {
  console.log('Error ' + err);
});

module.exports = client;
