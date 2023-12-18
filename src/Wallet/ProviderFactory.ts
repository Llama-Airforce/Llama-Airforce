import {
  type ExternalProvider,
  Web3Provider,
  type JsonRpcProvider,
} from "@ethersproject/providers";
import Onboard, { type OnboardAPI, type WalletState } from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import gnosisModule from "@web3-onboard/gnosis";

const injected = injectedModule();
const walletConnect = walletConnectModule({
  projectId: "7a61bbd683f613a5308ca86fd4cb14f7",
  dappUrl: "https://llama.airforce",
});
const coinbaseWallet = coinbaseWalletModule({ darkMode: true });
const gnosis = gnosisModule();

let onboard: OnboardAPI | null = null;

function getOnboard(): OnboardAPI {
  const onboard = Onboard({
    wallets: [injected, walletConnect, coinbaseWallet, gnosis],
    chains: [
      {
        id: "0x1",
        token: "ETH",
        label: "Ethereum Mainnet",
        rpcUrl: "https://mainnet.infura.io/v3/878382a352b14db1b7ad52a89a886207",
      },
    ],
    appMetadata: {
      name: "Llama Airforce",
      icon: "/wallet-icon.png",
      description: "Airdropping knowledge bombs about the Curve ecosystem",
    },
    theme: "dark",
  });

  onboard.state.actions.updateAccountCenter({
    enabled: false,
  });

  return onboard;
}

let walletConnected: WalletState | null = null;

export async function connectWallet(showModal = false) {
  if (!onboard) {
    onboard = getOnboard();
  }

  let [wallet] = onboard.state.get().wallets;

  if (!wallet) {
    const walletStored = window.localStorage.getItem("connectedWallet");

    if (walletStored) {
      [wallet] = await onboard.connectWallet({
        autoSelect: { label: walletStored, disableModals: true },
      });
    } else if (showModal) {
      [wallet] = (await onboard?.connectWallet()) ?? [null];

      if (wallet) {
        window.localStorage.setItem("connectedWallet", wallet.label);
      }
    }
  }

  walletConnected = wallet ? wallet : null;
}

export async function disconnectWallet(): Promise<void> {
  if (!onboard) {
    return;
  }

  const [primaryWallet] = onboard.state.get().wallets;
  await onboard.disconnectWallet({ label: primaryWallet.label });
  window.localStorage.removeItem("connectedWallet");
}

export function getProvider(): JsonRpcProvider | undefined {
  return walletConnected
    ? new Web3Provider(walletConnected.provider as ExternalProvider)
    : undefined;
}
