"use client";

import { useRef, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import axios from "axios";
import Link from "next/link";

import useStore from "@/store";
import { useTimer } from "@/hooks/useTimer";

export const RegisterButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { timeLeft, reset, tick, started, start, stop } = useTimer(30);
  const { token, errorMsg } = useStore((state) => state);
  const { address: ownerAddr, isDisconnected } = useAccount();
  const { chain } = useNetwork();

  const countDown = useRef<NodeJS.Timeout>();

  const handleClick = async () => {
    setTimeout(() => {
      setLoading(true);
    }, 500);

    setTimeout(() => {
      start();
      countDown.current = setInterval(() => {
        tick();
      }, 1000);
    }, 2000);

    try {
      const res = await axios.post("/api/register", {
        accessToken: token,
        ownerAddr,
        chainId: chain?.id,
      });
      const { nfts } = res.data;
      updateDevicesInLocalStorage(nfts);
      setSuccess(true);
    } catch (e: any) {
      console.log(e);
      setError(e.response.data.error || e.message);
    } finally {
      setLoading(false);
      clearInterval(countDown.current!);
      stop();
      reset();
    }
  };

  if (error) {
    return (
      <button
        onClick={() => setError("")}
        className="btn-outline-secondary w-1/3"
      >
        Failed to register. Try again.
      </button>
    );
  }

  if (success) {
    return (
      <Link href="/sbt" className="flex flex-col w-1/3">
        <button className="btn-primary">See devices</button>
      </Link>
    );
  }

  return (
    <button
      disabled={
        isDisconnected || loading || success || !token || !!errorMsg
      }
      onClick={handleClick}
      className="btn-outline-primary"
    >
      {isDisconnected && "Connect Wallet"}
      {loading && "Loading..."}
      {started && timeLeft > 0 && `${timeLeft}s`}
      {success && "Success!"}
      {!isDisconnected && !loading && !success && "Register"}
    </button>
  );
};

const updateDevicesInLocalStorage = (hashedDeviceIds: string[]) => {
  localStorage.setItem("devices", JSON.stringify(hashedDeviceIds));
};
