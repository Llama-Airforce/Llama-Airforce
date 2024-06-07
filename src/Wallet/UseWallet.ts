import {
  type JsonRpcProvider,
  type JsonRpcSigner,
} from "@ethersproject/providers";
import { type Network } from "@/Wallet/Network";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useConnectors,
  useConnectorClient,
} from "@wagmi/vue";
import { base, mainnet } from "viem/chains";
import { clientToProvider, clientToSigner } from "@/Wallet/Wagmi";

// eslint-disable-next-line max-lines-per-function
export function useWallet() {
  // Re-export for easier access through single import
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  // Account info
  const { address, isConnected, chainId, connector } = useAccount();

  const addressOnProvider = computed(() =>
    provider.value && address.value ? address.value : undefined
  );

  const network = computed((): Network | undefined => {
    switch (chainId.value) {
      case mainnet.id:
        return "ethereum";
      case base.id:
        return "base";
      default:
        return undefined;
    }
  });

  // Connectors and providers
  const connectorClient = useConnectorClient();
  const providerCowSwap = computedAsync(async () => {
    const prov = (await connector.value?.getProvider()) as JsonRpcProvider;
    return prov;
  });
  const provider = computed(() =>
    connectorClient.data.value
      ? clientToProvider(connectorClient.data.value)
      : undefined
  );
  const signer = computed(() =>
    connectorClient.data.value
      ? clientToSigner(connectorClient.data.value)
      : undefined
  );

  const withProvider = <T extends [...unknown[]]>(
    func: (
      provider: JsonRpcProvider,
      address: string,
      ...args: T
    ) => Promise<void>,
    ifNot?: (...args: T) => void
  ): ((...args: T) => Promise<void>) => {
    return (...args: T) => {
      if (!provider.value || !address.value) {
        return new Promise<void>((resolve) => {
          if (ifNot) {
            ifNot(...args);
          }

          resolve(); // resolve with no value
        });
      }

      return func(provider.value, address.value, ...args);
    };
  };

  const withProviderReturn = <T extends [...unknown[]], R>(
    func: (
      provider: JsonRpcProvider,
      address: string,
      ...args: T
    ) => Promise<R>,
    ifNot: (...args: T) => R
  ): ((...args: T) => Promise<R>) => {
    return (...args: T) => {
      if (!provider.value || !address.value) {
        return new Promise<R>((resolve) => {
          const x = ifNot(...args);
          resolve(x);
        });
      }

      return func(provider.value, address.value, ...args);
    };
  };

  const withSigner = <T extends [...unknown[]]>(
    func: (signer: JsonRpcSigner, address: string, ...args: T) => Promise<void>,
    ifNot?: (...args: T) => void
  ): ((...args: T) => Promise<void>) => {
    return (...args: T) => {
      if (!signer.value || !address.value) {
        return new Promise<void>((resolve) => {
          if (ifNot) {
            ifNot(...args);
          }

          resolve(); // resolve with no value
        });
      }

      return func(signer.value, address.value, ...args);
    };
  };

  const withSignerReturn = <T extends [...unknown[]], R>(
    func: (provider: JsonRpcSigner, address: string, ...args: T) => Promise<R>,
    ifNot: (...args: unknown[]) => R
  ): ((...args: T) => Promise<R>) => {
    return async (...args: T) => {
      if (!signer.value || !address.value) {
        return new Promise<R>((resolve) => {
          const x = ifNot(...args);
          resolve(x);
        });
      }

      return func(signer.value, address.value, ...args);
    };
  };

  return {
    connect,
    disconnect,
    isConnected,
    connectors,
    network,
    address: addressOnProvider,
    provider,
    providerCowSwap,
    signer,
    withProvider,
    withProviderReturn,
    withSigner,
    withSignerReturn,
  };
}
