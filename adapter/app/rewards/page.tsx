import dynamic from "next/dynamic";
import Script from "next/script";

import Wallet from "../components/Wallet";

const CollectibleList = dynamic(() => import("./CollectibleList"), {
  ssr: false,
});

export default function RewardsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12">
      <h1 className="text-4xl font-bold">Available to collect:</h1>
      <Wallet>
        <CollectibleList />
      </Wallet>
      <Script src="https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.10.1/tsparticles.confetti.bundle.min.js" />
    </main>
  );
}
