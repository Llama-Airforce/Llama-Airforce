import { type Address } from "@/Framework/Address";
import { useAccount, useConnectorClient } from "@wagmi/vue";

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

  return {
    isConnected,
    chainId,
    address: addressOnProvider,
  };
}
