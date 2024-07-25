import { type Address } from "@/Framework/Address";
import { base, mainnet } from "viem/chains";
import { useAccount, useConnectorClient } from "@wagmi/vue";
import { type Network } from "@/Wallet/Network";

export function useWallet() {
  // Account info
  const { address, isConnected, chainId } = useAccount();
  const connectorClient = useConnectorClient();

  // Make it reactive to the connector and also make it lower case as that's our usual convention.
  const addressOnProvider = computed(() =>
    connectorClient.data.value && address.value
      ? (address.value.toLocaleLowerCase() as Address)
      : undefined
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
