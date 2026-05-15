const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19953.crce214.us-east-1-3.ec2.cloud.redislabs.com',
        port: 19953
    }
});

module.exports = redisClient;