import Redis from "ioredis";

const DEFAULT_EXPIRATION: number = 4200;
const redisUrl: any = "redis://127.0.0.1:6379";
const redisClient: any = new Redis(redisUrl);

export function getCache(key: any) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error: any, result: any) => {
      if (error || result === null) return reject(error);
      console.log("Data: " + result);
      if (result != null) return resolve(JSON.parse(result));
    });
  });
}

export function setCache(key: any, expirationTime: any, cb: any) {
  return new Promise(async (resolve, reject) => {
    const newData = await cb();
    if (newData != null) {
      redisClient.set(
        key,
        JSON.stringify(newData),
        "EX",
        expirationTime ?? DEFAULT_EXPIRATION
      );
      resolve(newData);
    } else {
      reject("Error Occured");
    }
  });
}

export function deleteCache(key: any) {
  return new Promise(async (resolve, reject) => {
    try {
      redisClient.pipeline().del(key);
      resolve(true);
    } catch (err) {
      reject("Error Occured");
    }
  });
}
