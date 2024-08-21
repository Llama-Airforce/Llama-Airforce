import { walletConnect as walletConnectConnector } from "@wagmi/connectors";

export const walletConnect = walletConnectConnector({
  projectId: "7a61bbd683f613a5308ca86fd4cb14f7",
  showQrModal: true,
  qrModalOptions: {
    themeMode: "dark",
  },
});
