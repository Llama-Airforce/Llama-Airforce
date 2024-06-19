import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import {
  injected,
  walletConnect,
  coinbaseWallet,
  safe,
} from "@wagmi/connectors";

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

    coinbaseWallet(),
    safe(),
  ],
  transports: {
    //[mainnet.id]: http("https://eth.llamarpc.com"),
    [mainnet.id]: http(undefined, { batch: { wait: 100 } }),
  },
});
