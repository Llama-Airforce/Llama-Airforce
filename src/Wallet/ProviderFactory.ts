import { providers } from "ethers";
import type { Account, Client, Chain, Transport } from "viem";
import { type Config, getConnectorClient } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

import Onboard, { type OnboardAPI } from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import gnosisModule from "@web3-onboard/gnosis";
import wagmi, { getClient, disconnect } from "@web3-onboard/wagmi";

const injected = injectedModule();
const walletConnect = walletConnectModule({
  projectId: "7a61bbd683f613a5308ca86fd4cb14f7",
  dappUrl: "https://llama.airforce",
});
const coinbaseWallet = coinbaseWalletModule({ darkMode: true });
const gnosis = gnosisModule();

let onboard: OnboardAPI | null = null;

// Web3-Onboard
function getOnboard() {
  const onboard = Onboard({
    wagmi,
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

// Connecting
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
}

export async function disconnectWallet(): Promise<void> {
  if (!onboard) {
    return;
  }

  const wagmiConfig = onboard.state.get().wagmiConfig;
  const [activeWallet] = onboard.state.get().wallets;
  if (activeWallet) {
    const { wagmiConnector } = activeWallet;
    if (wagmiConfig && wagmiConnector) {
      await disconnect(wagmiConfig, { connector: wagmiConnector });
    }
  }

  window.localStorage.removeItem("connectedWallet");
}

// Providers and signers
export function getProvider() {
  if (!onboard) {
    onboard = getOnboard();
  }

  const wagmiConfig = onboard.state.get().wagmiConfig;
  if (wagmiConfig) {
    const client = getClient(wagmiConfig, { chainId: mainnet.id });
    if (client) {
      return clientToProvider(client as Client<Transport, Chain>);
    }
  }

  return undefined;
}

export async function getSigner() {
  if (!onboard) {
    onboard = getOnboard();
  }

  const wagmiConfig = onboard.state.get().wagmiConfig;
  if (wagmiConfig) {
    try {
      const client = await getConnectorClient(wagmiConfig as Config, {
        chainId: mainnet.id,
      });

      return clientToSigner(client);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

// Wagmi
export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new providers.JsonRpcProvider(transport.url, network);
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
