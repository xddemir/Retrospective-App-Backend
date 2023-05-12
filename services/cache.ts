import redis from "redis";

const DEFAULT_EXPIRATION: number = 4200;
const redisUrl: any = "redis://127.0.0.1:6379";
const redisClient: any = redis.createClient(redisUrl);

export function setOrGetCache(key: any, cb: any, expirationTime: any) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error: any, data: any) => {
      if (error) return reject(error);
      if (data != null) return resolve(JSON.parse(data));
      const newData = await cb();
      redisClient.setEx(key, expirationTime ?? DEFAULT_EXPIRATION, JSON.stringify(newData));
      resolve(newData);
    });
  });
}
