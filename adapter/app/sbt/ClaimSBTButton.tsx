"use client";

import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { sbtContract } from "@/features/web3/services/viem/nft";

export const ClaimSBTButton = ({ deviceId }: { deviceId: string }) => {
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: sbtContract(chain?.id || 0)?.address,
    abi: sbtContract(chain?.id || 0)?.abi as any,
    functionName: "mintSBT",
    args: [deviceId],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite({ ...config });

  const { isLoading: isWaiting } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
  });

  return (
    <div>
      <button
        disabled={!write || isLoading || isWaiting}
        onClick={() => write?.()}
      >
        Claim SBT
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isWaiting && <div>Claiming...</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
};
