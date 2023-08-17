import * as deployments from "../../contracts/deployments.json";

export const sbtContract = (chainId: number) => {
  const sbtConfig = (deployments as any)[chainId]?.[0].contracts.DeviceSBT;

  if (!sbtConfig) throw new Error(`No SBT contract found for chainId ${chainId}`);

  return {
    address: sbtConfig.address as `0x${string}`,
    abi: sbtConfig.abi,
  }
}

export const rewardsContract = (chainId: number) => {
  const rewardsConfig = (deployments as any)[chainId]?.[0].contracts.DeviceRewards;

  if (!rewardsConfig) throw new Error(`No Rewards contract found for chainId ${chainId}`);

  return {
    address: rewardsConfig.address as `0x${string}`,
    abi: rewardsConfig.abi,
  }
}

export const checkIfContractExists = (chainId: number) => {
  const sbtConfig = (deployments as any)[chainId]?.[0].contracts.DeviceSBT;
  const rewardsConfig = (deployments as any)[chainId]?.[0].contracts.DeviceRewards;

  if (!sbtConfig || !rewardsConfig) return false;

  return true;
}