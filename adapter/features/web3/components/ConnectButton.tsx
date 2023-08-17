import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";

export const WithWallet = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected || !chain?.id) {
    return <ConnectHandler />;
  }

  if (chain.unsupported) {
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
  const { isLoading, pendingChainId, switchNetwork, chains } = useSwitchNetwork();

  return (
    <div className="flex flex-col gap-2 items-center">
      Switch to a supported network:
      {chains.map((chain) => (
      <button
        disabled={!switchNetwork || isLoading}
        key={chain.id}
        onClick={() => switchNetwork?.(chain.id)}
        className="btn-primary w-full"
      >
        {chain.name}
        {isLoading && pendingChainId === chain.id && " (switching)"}
      </button>
      ))}
    </div>
  )
};
