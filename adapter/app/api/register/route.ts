import { NextRequest, NextResponse } from "next/server";

import { hashString as hashDeviceId } from "@/features/secrets/utils/hash";
import { registerDevice } from "@/features/web3/services/viem/registrationContract";
import { bindDevice } from "@/features/web3/services/viem/bindingContract";

// A route for registering devices on-chain
export async function POST(req: NextRequest) {
  const { accessToken, ownerAddr, chainId } = await req.json();

  if (!accessToken || !ownerAddr) {
    return NextResponse.json(
      { error: "Not valid credentials" },
      { status: 401 }
    );
  }

  if (!chainId) {
    return NextResponse.json(
      { error: "Not valid chainId" },
      { status: 400 }
    );
  }

  try {
    // TODO: get user devices from db
    const userDevices: { id: string }[] = [];
    const hashedDeviceIds = userDevices.map(
      (device) => "0x" + hashDeviceId(device.id)
    );

    const txResults = await registerOnChain(hashedDeviceIds, ownerAddr, chainId);

    return NextResponse.json({
      success: true,
      txResults,
    });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

async function registerOnChain(deviceIds: string[], ownerAddr: string, chainId: number) {
  try {
    const registerTx = await registerDevice(deviceIds, chainId);
    const bindTx = await bindDevice(deviceIds, ownerAddr, chainId);
    return {
      registerTx: registerTx.transactionHash,
      bindTx: bindTx.transactionHash,
    };
  } catch (error) {
    throw error;
  }
}
