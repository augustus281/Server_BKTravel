const redis = require("redis")
const { redis: { host, port } } = require("./config")

class RedisConfig {
    constructor() {
        this.connect()
    }

    connect() {
        const client = redis.createClient({
            port: port,
            host: host
        })
        client.on('error', err => console.log('Redis Client Error', err));

        client.connect()
            .then(_ => {
                console.log(`Connect to Redis successfully`);
            }).catch(err => {
                console.log(err)
            });
    }

    static getInstance() {
        if (!RedisConfig.instance) {
            RedisConfig.instance = new RedisConfig()
        }

        return RedisConfig.instance
    }
}

const instanceRedis = RedisConfig.getInstance()
module.exports = instanceRedis