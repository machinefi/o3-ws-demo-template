import { SyncButton } from "./SyncButton";
import Wallet from "../components/Wallet";

export default function SyncDataPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
      <div className="flex flex-col gap-4 text-center">
        <h1>Sync your driven distances:</h1>
        <p className="text-secondary-400">
          1. We will collect driven distance of your registered devices <br />
          2. We will send this data to W3bstream <br />
          3. W3bstream will evaluate your driven distance and send you a reward
        </p>
      </div>
      <Wallet>
        <SyncButton />
      </Wallet>
    </main>
  );
}
