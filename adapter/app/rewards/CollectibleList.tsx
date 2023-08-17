"use client";

import { useAccount, useContractRead, useNetwork } from "wagmi";

import { rewardsContract } from "@/features/web3/services/viem/nft";
import { CollectButton } from "./CollectButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const TOKEN_ID = 1;

export const CollectibleList = () => {
  const [copied, setCopied] = useState(false);

  const { address } = useAccount();
  const {chain} = useNetwork();

  const {
    data: nftAllowanceData,
    isLoading,
    isError,
  } = useContractRead({
    address: rewardsContract(chain?.id || 0)?.address,
    abi: rewardsContract(chain?.id || 0)?.abi as any,
    functionName: "allowance",
    args: [TOKEN_ID, address ?? ""],
    watch: true,
    suspense: true,
  });

  const [metadata, setMetadata] = useState<
    { name: string; description: string; image: string } | undefined
  >();

  const { data: nftUri }: { data: string | undefined } = useContractRead({
    address: rewardsContract(chain?.id || 0)?.address,
    abi: rewardsContract(chain?.id || 0)?.abi as any,
    functionName: "uri",
    args: [1],
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      const nftURI = nftUri!.replace(
        "{id}",
        "0000000000000000000000000000000000000000000000000000000000000001"
      );
      const _metadata = await axios.get(nftURI);
      setMetadata(_metadata.data);
    };

    if (nftUri) {
      fetchMetadata();
    }
  }, [nftUri]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex flex-col justify-between gap-4 text-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl">
            ERC1155 - {metadata?.name || "Token name"} - ID: {TOKEN_ID}
          </h3>
          <p>{metadata?.description || "Token description"}</p>
          <p
            className="text-secondary-500 hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(rewardsContract(chain?.id || 0)?.address);
              setCopied(true);
            }}
          >
            Address: {rewardsContract(chain?.id || 0)?.address} -{" "}
            {copied ? "Copied!" : "Click to copy"}
          </p>
        </div>
        <Image
          className="rounded-lg self-center border border-primary-900 border-small"
          src={metadata?.image || "/images/collectible.png"}
          width={400}
          height={400}
          alt={metadata?.description || "NFT image"}
        />
        <div className="flex flex-row justify-center items-center gap-2">
          <div
            className="w-3 h-3 bg-green-400 rounded-full
                        animate-pulse"
          ></div>
          <p>Available to collect: {Number(nftAllowanceData || 0)}</p>
        </div>
        <CollectButton tier={1} />
      </div>
    </div>
  );
};

export default CollectibleList;
