import "server-only";

import redisCli from "./client";
import { EncryptedToken } from "@/types";

export const storeString = async (key: string, value: string) => {
  await redisCli.set(key, value);
};

export const store = async (key: string, value: EncryptedToken) => {
  const tx = redisCli.multi();
  tx.hset(key, {
    iv: value.iv,
    encryptedData: value.encryptedData,
  });

  return tx.exec();
};
