import {
  createConfig as createConfigWagmi,
  fallback,
  http,
  unstable_connector,
} from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import type { CreateConnectorFn } from "@wagmi/vue";
import { injected } from "@wagmi/connectors";

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
