const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-12651.c17.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 12651
    }
});

module.exports = redisClient;