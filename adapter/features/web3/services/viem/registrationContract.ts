import "server-only";

import * as deployments from "../../contracts/deployments.json";
import { walletClient, publicClient } from "./client";


const registryContract = (chainId: number) => {
  const registryConfig = (deployments as any)[chainId]?.[0].contracts.DeviceRegistry;

  if (!registryConfig) throw new Error(`No Registry contract found for chainId ${chainId}`);

  return {
    address: registryConfig.address as `0x${string}`,
    abi: registryConfig.abi,
  }
}

export async function registerDevice(deviceIds: string[], chainId: number) {
  const devicesStatuses = await getDeviceStatuses(deviceIds, chainId);
  const devicesToRegister = deviceIds.filter(
    (_, index) => !devicesStatuses[index]
  );

  if (devicesToRegister.length === 0) {
    return { transactionHash: "already registered" };
  }

  const { address, abi } = registryContract(chainId);

  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address,
    abi,
    functionName: "registerDevices",
    args: [devicesToRegister],
  });
  const hash = await walletClient.writeContract(request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
}

async function getDeviceStatuses(deviceIds: string[], chainId: number): Promise<boolean[]> {
  const { address, abi } = registryContract(chainId);

  try {
    return publicClient.readContract({
      address,
      abi,
      functionName: "isAuthorizedDevices",
      args: [deviceIds],
    }) as Promise<boolean[]>;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to check if device is registered");
  }
}
