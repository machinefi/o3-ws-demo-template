import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { iotexTestnet } from "viem/chains";

export const WithWallet = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected) {
    return <ConnectHandler />;
  }

  if (chain!.id !== iotexTestnet.id) {
    return <SwitchHandler />;
  }

  return <>{children}</>;
};

export default WithWallet;

const ConnectHandler = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  if (error) {
    return (
      <>
        error && <div>{error.message}</div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {connectors.map((connector) => (
        <button
          className="btn-primary"
          disabled={!connector.ready || isLoading}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect Wallet
          {isLoading &&
            pendingConnector?.id === connector.id &&
            " (connecting)"}
        </button>
      ))}
    </div>
  );
};

const SwitchHandler = () => {
  const { chain } = useNetwork();
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
    chainId: iotexTestnet.id,
  });

  return (
    <div className="flex flex-col items-center">
      <button
        disabled={!switchNetwork || chain?.id === iotexTestnet.id}
        key={iotexTestnet.id}
        onClick={() => switchNetwork?.(iotexTestnet.id)}
        className="btn-primary"
      >
        Switch to {iotexTestnet.name}
        {isLoading && pendingChainId === iotexTestnet.id && " (switching)"}
      </button>
    </div>
  );
};
