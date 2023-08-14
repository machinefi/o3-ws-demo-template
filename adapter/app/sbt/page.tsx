import Devices from "./Devices";

export default function DevicesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <div className="flex flex-col gap-4 text-center">
        <h1>Your Devices</h1>
        <p className="text-secondary-400">
          This is the list of your DIMO NFTs: <br />
        </p>
      </div>
      <Devices />
    </main>
  );
}
