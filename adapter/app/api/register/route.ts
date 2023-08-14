import { NextRequest, NextResponse } from "next/server";

import { hashString as hashDeviceId } from "@/features/secrets/utils/hash";
import { registerDevice } from "@/features/web3/services/viem/registrationContract";
import { bindDevice } from "@/features/web3/services/viem/bindingContract";
import { fetchUserDevices } from "@/features/data/services/dimo/get-user-devices";
import { encrypt as encryptDimoJWT } from "@/features/secrets/utils/encryption";
import { store } from "@/features/secrets/services/redis/store";
import { DIMO_REDIS_TOKEN_KEY } from "@/app/config";

export async function POST(req: NextRequest) {
  const { dimoToken, ownerAddr } = await req.json();

  if (!dimoToken || !ownerAddr) {
    return NextResponse.json(
      { error: "Not valid credentials" },
      { status: 401 }
    );
  }

  try {
    const userDevices = await fetchUserDevices(dimoToken);
    const hashedDeviceIds = userDevices.map(
      (device) => "0x" + hashDeviceId(device.id)
    );
    const encryptedObj = encryptDimoJWT(dimoToken);
    await storeDimoJWT(encryptedObj, ownerAddr);

    const txResults = await registerOnChain(hashedDeviceIds, ownerAddr);

    return NextResponse.json({
      success: true,
      nfts: userDevices.map((device) => device.nft?.tokenId || 0).filter(Boolean),
      txResults,
    });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

async function storeDimoJWT(encryptedObj: any, ownerAddr: string) {
  const res = await store(DIMO_REDIS_TOKEN_KEY + ownerAddr, encryptedObj);
  if (!res) {
    throw new Error("Failed to store dimo token");
  }
}

async function registerOnChain(deviceIds: string[], ownerAddr: string) {
  try {
    const registerTx = await registerDevice(deviceIds);
    const bindTx = await bindDevice(deviceIds, ownerAddr);
    return {
      registerTx: registerTx.transactionHash,
      bindTx: bindTx.transactionHash,
    };
  } catch (error) {
    throw error;
  }
}
