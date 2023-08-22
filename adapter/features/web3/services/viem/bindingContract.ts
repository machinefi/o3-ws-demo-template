import "server-only";

import * as deployments from "../../contracts/deployments.json";
import { walletClient, publicClient } from "./client";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

const bindingContract = (chainId: number) => {
  const bindingConfig = (deployments as any)[chainId]?.[0].contracts.DeviceBinding;

  if (!bindingConfig) throw new Error(`No Binding contract found for chainId ${chainId}`);

  return {
    address: bindingConfig.address as `0x${string}`,
    abi: bindingConfig.abi,
  }
}

export async function bindDevice(deviceIds: string[], ownerAddr: string, chainId: number) {
  const bindingStates = await getBindingStates(deviceIds, chainId);

  const devicesToBind = deviceIds.filter((_, index) => !bindingStates[index]);

  const { address, abi } = bindingContract(chainId);

  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address,
    abi,
    functionName: "bindDevices",
    args: [devicesToBind, ownerAddr],
  });
  const hash = await walletClient.writeContract(request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
}

async function getBindingStates(deviceIds: string[], chainId: number): Promise<boolean[]> {
  const bindingStates = await Promise.all(deviceIds.map((deviceId) => getBindingState(deviceId, chainId)));
  return bindingStates.map((state) => state != ZERO_ADDR);
}

async function getBindingState(deviceId: string, chainId: number): Promise<string> {
  const { address, abi } = bindingContract(chainId);
  try {
    return publicClient.readContract({
      address,
      abi,
      functionName: "getDeviceOwner",
      args: [deviceId],
    }) as unknown as string;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to check if device is bound");
  }
}
