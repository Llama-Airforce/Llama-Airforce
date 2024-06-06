import { computed } from "vue";
import { useWalletStore } from "@/Wallet/Store";
import {
  connectWallet as connectWalletFunc,
  disconnectWallet as disconnectWalletFunc,
  getProvider,
  getSigner,
} from "@/Wallet/ProviderFactory";
import { getNetwork } from "@/Wallet/WalletHelper";

// eslint-disable-next-line max-lines-per-function
export function useWallet() {
  const store = useWalletStore();

  const connected = computed(() => store.connected);
  const network = computed(() => store.network);
  const address = computed(() => store.address);

  const connectWallet = async (showModal = false) => {
    await connectWalletFunc(showModal);
    const provider = getProvider();

    const connected = !!provider;
    store.connected = connected;

    const network = await getNetwork(provider);
    store.network = network;
  };

  const disconnectWallet = async () => {
    await disconnectWalletFunc();
    store.connected = false;
  };

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

  type ThenArg<T> = T extends Promise<infer U> ? U : T;

  const withSigner = <T extends [...unknown[]]>(
    func: (
      signer: NonNullable<ThenArg<ReturnType<typeof getSigner>>>,
      address: string,
      ...args: T
    ) => Promise<void>,
    ifNot?: (...args: T) => void
  ): ((...args: T) => Promise<void>) => {
    return async (...args: T) => {
      const signer = await getSigner();

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
      provider: NonNullable<ThenArg<ReturnType<typeof getSigner>>>,
      address: string,
      ...args: T
    ) => Promise<R>,
    ifNot: (...args: unknown[]) => R
  ): ((...args: T) => Promise<R>) => {
    return async (...args: T) => {
      const signer = await getSigner();

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
    network,
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
