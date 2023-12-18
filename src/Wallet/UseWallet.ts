import { computed } from "vue";
import { useWalletStore } from "@/Wallet/Store";
import {
  connectWallet as connectWalletFunc,
  disconnectWallet as disconnectWalletFunc,
  getProvider,
} from "@/Wallet/ProviderFactory";
import { isConnected, isMainnet } from "@/Wallet/WalletHelper";

// eslint-disable-next-line max-lines-per-function
export function useWallet() {
  const store = useWalletStore();

  const connected = computed(() => store.connected);
  const correctNetwork = computed(() => store.correctNetwork);
  const address = computed(() => store.address);

  const connectWallet = async (showModal = false) => {
    await connectWalletFunc(showModal);
    const provider = getProvider();

    const connected = await isConnected(provider);
    store.connected = connected;

    const correctNetwork = await isMainnet(provider);
    store.correctNetwork = correctNetwork;
  };

  const disconnectWallet = async () => {
    await disconnectWalletFunc();
    store.connected = false;
  };

  const getSigner = () => getProvider()?.getSigner();

  // Call a function with provider and address if available.
  const withProvider = <T extends [...unknown[]]>(
    func: (
      provider: NonNullable<ReturnType<typeof getProvider>>,
      address: string,
      ...args: T
    ) => Promise<void>,
    ifNot?: (...args: T) => void
  ): ((...args: T) => Promise<void>) => {
    return (...args: T) => {
      const provider = getProvider();

      if (!provider || !address.value) {
        return new Promise<void>((resolve) => {
          if (ifNot) {
            ifNot(...args);
          }

          resolve(); // resolve with no value
        });
      }

      return func(provider, address.value, ...args);
    };
  };

  const withProviderReturn = <T extends [...unknown[]], R>(
    func: (
      provider: NonNullable<ReturnType<typeof getProvider>>,
      address: string,
      ...args: T
    ) => Promise<R>,
    ifNot: (...args: T) => R
  ): ((...args: T) => Promise<R>) => {
    return (...args: T) => {
      const provider = getProvider();

      if (!provider || !address.value) {
        return new Promise<R>((resolve) => {
          const x = ifNot(...args);
          resolve(x);
        });
      }

      return func(provider, address.value, ...args);
    };
  };

  const withSigner = <T extends [...unknown[]]>(
    func: (
      provider: NonNullable<ReturnType<typeof getSigner>>,
      address: string,
      ...args: T
    ) => Promise<void>,
    ifNot?: (...args: T) => void
  ): ((...args: T) => Promise<void>) => {
    return (...args: T) => {
      const signer = getSigner();

      if (!signer || !address.value) {
        return new Promise<void>((resolve) => {
          if (ifNot) {
            ifNot(...args);
          }

          resolve(); // resolve with no value
        });
      }

      return func(signer, address.value, ...args);
    };
  };

  const withSignerReturn = <T extends [...unknown[]], R>(
    func: (
      provider: NonNullable<ReturnType<typeof getSigner>>,
      address: string,
      ...args: T
    ) => Promise<R>,
    ifNot: (...args: unknown[]) => R
  ): ((...args: T) => Promise<R>) => {
    return (...args: T) => {
      const signer = getSigner();

      if (!signer || !address.value) {
        return new Promise<R>((resolve) => {
          const x = ifNot(...args);
          resolve(x);
        });
      }

      return func(signer, address.value, ...args);
    };
  };

  return {
    connected,
    correctNetwork,
    address,
    getProvider,
    getSigner,
    withProvider,
    withProviderReturn,
    withSigner,
    withSignerReturn,
    connectWallet,
    disconnectWallet,
  };
}
