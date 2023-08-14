import "server-only";

import redisCli from "./client";

export const loadDate = (key: string) => redisCli.get(key);
export const load = (key: string) => redisCli.hgetall(key);
export const loadAllKeys = (keys: string = "") => redisCli.keys(keys + "*");