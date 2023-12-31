"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import arduino from "public/arduino.png";

import { useDeviceIds } from "@/hooks/useDeviceIds";
import { ErrorText } from "../components/text/ErrorText";

export default function Devices() {
  const devices = useDeviceIds();

  if (!devices.length) {
    return <EmptyDevicesList />;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap flex-row items-center justify-center gap-4">
        {devices.map((device) => (
          <div
            key={device}
            className="flex flex-col text-center items-center justify-center gap-4"
          >
            <DeviceNFT id={device} />
          </div>
        ))}
      </div>
      <Link href="/syncdata">
        <button className="btn-outline-primary">Sync devices data</button>
      </Link>
    </div>
  );
}

interface DeviceMetadata {
  name: string;
  description: string;
  image: string;
}

const DeviceNFT = (props: { id: string }) => {
  const [metadata] = useState<DeviceMetadata | undefined>();

  return (
    <div className="relative group flex flex-col text-center items-center justify-center gap-4">
      <Image
        src={metadata?.image || arduino}
        className="rounded-lg border border-primary-900 border-small"
        alt={metadata?.name || "Device image"}
        width={300}
        height={300}
      />
      <div
        className="absolute bottom-0 left-0 right-0 p-2 px-4 
      text-white duration-300 bg-black opacity-0 group-hover:opacity-100 
      bg-opacity-40 rounded-b-lg"
      >
        <div className="flex justify-between w-full">
          <div className="font-normal">
            <p className="text-md">{metadata?.name || "name"}</p>
            <p className="text-sm">{metadata?.description || "description"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyDevicesList = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <ErrorText error="No devices registered" />
    <Link href="/register">
      <button className="btn-outline-primary">Register device</button>
    </Link>
  </div>
);
