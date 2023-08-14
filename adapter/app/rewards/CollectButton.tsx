"use client";

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { rewardsContract } from "@/features/web3/services/viem/nft";

export const CollectButton = ({ tier }: { tier: number }) => {
  const { config } = usePrepareContractWrite({
    address: rewardsContract.address,
    abi: rewardsContract.abi,
    functionName: "mintFromAllowance",
    args: [tier, []],
  });

  const { data, isLoading, write } = useContractWrite(config);

  const { isLoading: isWaiting, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    onSuccess: () => {
      const count = 200,
        defaults = {
          origin: { y: 0.7 },
        };

      function fire(particleRatio: number, opts: any) {
        // @ts-ignore
        confetti?.(
          Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
          })
        );
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    },
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="btn-outline-primary"
        disabled={!write || isLoading || isWaiting}
        onClick={() => write?.()}
      >
        {isLoading && <div>Check Wallet</div>}
        {isWaiting && <div>Collecting...</div>}
        {!isLoading && !isWaiting && <div>Collect</div>}
      </button>
      {isSuccess && (
        <div className="text-secondary-500">
          Transaction: {JSON.stringify(data)}
        </div>
      )}
    </div>
  );
};
