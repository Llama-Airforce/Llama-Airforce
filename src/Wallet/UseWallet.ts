import { type Network } from "@/Wallet/Network";
import { useAccount, useConnectorClient } from "@wagmi/vue";
import { base, mainnet } from "viem/chains";

export function useWallet() {
  // Account info
  const { address, isConnected, chainId } = useAccount();
  const connectorClient = useConnectorClient();

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

  return {
    isConnected,
    network,
    address: addressOnProvider,
  };
}
