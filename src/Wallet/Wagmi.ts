import { createConfig, fallback, http, unstable_connector } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { injected, walletConnect, safe } from "@wagmi/connectors";

// Alternative: https://eth.llamarpc.com
let rpc: string | undefined = "http://localhost:8545";
rpc = undefined;

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),

    walletConnect({
      projectId: "7a61bbd683f613a5308ca86fd4cb14f7",
      showQrModal: true,
      qrModalOptions: {
        themeMode: "dark",
      },
    }),

    safe(),
  ],
  transports: {
    [mainnet.id]: fallback([
      http(rpc, { batch: { wait: 100 } }),
      unstable_connector(injected),
      http("https://eth.llamarpc.com", { batch: { wait: 200 } }),
    ]),
  },
});
