import Devices from "./Devices";
import { INTEGRATION_NAME } from "../config";

export default function DevicesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <div className="flex flex-col gap-4 text-center">
        <h1>Your Devices</h1>
        <p className="text-secondary-400">
          This is the list of your {INTEGRATION_NAME} NFTs: <br />
        </p>
      </div>
      <Devices />
    </main>
  );
}
