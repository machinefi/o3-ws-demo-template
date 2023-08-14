"use client";

import axios from "axios";
import { useState } from "react";
import { useAccount } from "wagmi";

import { useDeviceIds } from "@/hooks/useDeviceIds";
import { ErrorText } from "../components/text/ErrorText";
import Link from "next/link";

export const SyncButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const devices = useDeviceIds();

  const { address: ownerAddr, isDisconnected } = useAccount();

  const handleClick = async () => {
    setTimeout(() => {
      setLoading(true);
    }, 500);

    try {
      await axios.post("/api/pull-data", { ownerAddr });
      await axios.post("/api/evaluate");
      setSuccess(true);
    } catch (e: any) {
      console.log(e);
      setError(e.response.data.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!devices.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <ErrorText error="No devices registered" />
        <Link href="/register">
          <button className="btn-outline-primary">Register device</button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <button onClick={() => setError("")} className="btn-outline-secondary">
        Sync failed. Try again.
      </button>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Link href="/rewards">
          <button className="btn-primary">Go to Rewards</button>
        </Link>

        <button
          onClick={() => setSuccess(false)}
          className="btn-outline-secondary"
        >
          Sync Another
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn-outline-primary"
      disabled={loading || success || isDisconnected}
      onClick={handleClick}
    >
      {isDisconnected && "Connect Wallet"}
      {loading && "Loading..."}
      {success && "Success!"}
      {!isDisconnected && !loading && !success && "Start sync"}
    </button>
  );
};
