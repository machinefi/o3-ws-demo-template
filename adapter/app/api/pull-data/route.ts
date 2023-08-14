import { NextRequest, NextResponse } from "next/server";

import { uploadDistanceToWS } from "@/features/data/services/w3bstream/client";
import { load } from "@/features/secrets/services/redis/load";
import { DIMO_REDIS_TOKEN_KEY } from "@/app/config";
import { EncryptedToken } from "@/types";
import { decrypt } from "@/features/secrets/utils/encryption";
import { fetchUserDevices } from "@/features/data/services/dimo/get-user-devices";
import { fetchDeviceDistances } from "@/features/data/services/dimo/get-driven-distance";
import { DeviceWithDistances, Distance, UserDevice } from "@/app/types";

export async function POST(req: NextRequest) {
  const { ownerAddr } = await req.json();

  try {
    const distances = await fetchUserDistances(ownerAddr);
    await processDistances(distances);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { error: e.response?.data?.error || e.message || "Unknown error" },
      { status: e.response?.status || 500 }
    );
  }
}

async function fetchUserDistances(ownerAddr: string) {
  const dimoJWT = await fetchAndDecryptToken(ownerAddr);
  const userDevices = await fetchUserDevices(dimoJWT);
  return fetchDistances(dimoJWT, userDevices);
}

async function fetchAndDecryptToken(ownerAddr: string) {
  const token = await fetchToken(ownerAddr);
  return decrypt(token);
}

async function fetchToken(ownerAddr: string) {
  const token = await load(DIMO_REDIS_TOKEN_KEY + ownerAddr);
  if (!token) {
    throw new Error("No token found");
  }
  return token as unknown as EncryptedToken;
}

async function fetchDistances(
  jwt: string,
  devices: UserDevice[]
): Promise<DeviceWithDistances[]> {
  return Promise.all(
    devices.map(async (device) => {
      const rawDistances = await fetchDeviceDistances(jwt, device.id);
      const distances = sanitizeDistances(rawDistances);
      return {
        id: device.id,
        distances,
      };
    })
  );
}

function sanitizeDistances(distances: Distance[]): Distance[] {
  return distances.filter((d) => d.distance > 0);
}

async function processDistances(distances: DeviceWithDistances[]) {
  await Promise.all(
    distances.map(async (distance) => {
      await uploadDistanceToWS(distance);
    })
  );
}
