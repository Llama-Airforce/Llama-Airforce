import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { injected, coinbaseWallet, safe } from "@wagmi/connectors";
import type { Account, Chain, Client, Transport } from "viem";
import { providers } from "ethers";

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    /*
     * walletConnect({
     *   projectId: "7a61bbd683f613a5308ca86fd4cb14f7",
     *   showQrModal: true,
     *   qrModalOptions: {
     *     themeMode: "dark",
     *   },
     * }),
     */
    coinbaseWallet(),
    safe(),
  ],
  transports: {
    //[mainnet.id]: http("https://eth.llamarpc.com"),
    [mainnet.id]: http(),
  },
});

// Functions for ethers migration.
export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return new providers.Web3Provider(transport, network);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}
