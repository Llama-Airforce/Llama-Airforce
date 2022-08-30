import {
  ExternalProvider,
  Web3Provider,
  JsonRpcProvider,
} from "@ethersproject/providers";
import Onboard, { OnboardAPI, WalletState } from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import gnosisModule from "@web3-onboard/gnosis";

const injected = injectedModule();
const walletConnect = walletConnectModule({
  qrcodeModalOptions: {
    mobileLinks: [
      "rainbow",
      "metamask",
      "argent",
      "trust",
      "imtoken",
      "pillar",
    ],
  },
});
const coinbaseWallet = coinbaseWalletModule({ darkMode: true });
const gnosis = gnosisModule();

let onboard: OnboardAPI | null = null;

export function getOnboard(): OnboardAPI {
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
      icon: "/card.png",
      description: "Airdropping knowledge bombs about the Curve ecosystem",
    },
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

export function getProvider(): JsonRpcProvider | undefined {
  return walletConnected
    ? new Web3Provider(walletConnected.provider as ExternalProvider)
    : undefined;
}

export async function clearProvider(): Promise<void> {
  if (!onboard) {
    return;
  }

  const [primaryWallet] = onboard.state.get().wallets;
  await onboard.disconnectWallet({ label: primaryWallet.label });
  window.localStorage.removeItem("connectedWallet");
}
