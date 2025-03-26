import {
  injected,
  walletConnect as walletConnectConnector,
} from "@wagmi/connectors";
import {
  createConfig as createConfigWagmi,
  fallback,
  http,
  unstable_connector,
} from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import type { CreateConnectorFn } from "@wagmi/vue";
import { useAccount as useAccountWagmi } from "@wagmi/vue";

// Alternative: https://eth.llamarpc.com
let rpc: string | undefined = "http://localhost:8545";
rpc = undefined;

export function createConfig(connectorsExtra: CreateConnectorFn[] = []) {
  return createConfigWagmi({
    chains: [mainnet],
    connectors: [injected(), ...connectorsExtra],
    transports: {
      [mainnet.id]: fallback([
        http(rpc, { batch: { wait: 100 } }),
        unstable_connector(injected),
        http("https://eth.llamarpc.com", { batch: { wait: 200 } }),
      ]),
    },
  });
}

export const walletConnect = walletConnectConnector({
  projectId: "7a61bbd683f613a5308ca86fd4cb14f7",
  showQrModal: true,
  qrModalOptions: {
    themeMode: "dark",
  },
});

/**
 * The return type of account.address from wagmi is Ref<string> instead of Ref<`0x${string}`>.
 * This function re-exports useAccount with the correct Address type.
 */
export function useAccount() {
  const account = useAccountWagmi();
  return { ...account, address: account.address as Ref<Address | undefined> };
}
