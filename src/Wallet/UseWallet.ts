import { type Network } from "@/Wallet/Network";
import {
  useClient,
  useAccount,
  useConnect,
  useDisconnect,
  useConnectors,
  useConnectorClient,
} from "@wagmi/vue";
import { base, mainnet } from "viem/chains";

// eslint-disable-next-line max-lines-per-function
export function useWallet() {
  // Re-export for easier access through single import
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const client = useClient();

  // Account info
  const { address, isConnected, chainId, connector } = useAccount();

  const addressOnProvider = computed(() =>
    connectorClient.data.value && address.value ? address.value : undefined
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
    const prov = await connector.value?.getProvider();
    return prov;
  });

  return {
    client,
    connect,
    disconnect,
    isConnected,
    connectors,
    network,
    address: addressOnProvider,
    providerCowSwap,
  };
}
