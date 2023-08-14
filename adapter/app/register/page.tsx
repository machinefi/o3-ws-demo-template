import Wallet from "../components/Wallet";
import { TokenControl } from "./TokenControl";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 text-center">
      <div className="flex flex-col gap-4">
        <h1>Register your Devices</h1>
        <p className="text-secondary-400">
          1. Registration will bind your devices to connected wallet address on chain <br />
          2. W3bstream will receive the registration event and store the ownership of the devices <br />
        </p>
      </div>
      <div className="flex flex-col gap-2 w-1/2">
        <Wallet>
          <TokenControl />
        </Wallet>
      </div>
    </main>
  );
}
