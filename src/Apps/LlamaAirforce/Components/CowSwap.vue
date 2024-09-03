<script setup lang="ts">
import { useAccount } from "@wagmi/vue";
import {
  type EthereumProvider,
  type CowSwapWidgetParams,
  type CowSwapWidgetHandler,
  TradeType,
  createCowSwapWidget,
} from "@cowprotocol/widget-lib";

const { buy, sell, level } = defineProps<{
  buy?: string; // Token Symbol
  sell?: string; // Token Symbol
  level: 1 | 2;
}>();

// Cowswap
const { connector } = useAccount();
const provider = computedAsync(async () => {
  const prov = await connector.value?.getProvider();
  return prov;
});

const cow = ref<HTMLElement | undefined>(undefined);
let cowHandler: CowSwapWidgetHandler | undefined = undefined;

onUnmounted(() => {
  cowHandler?.destroy();
});

watchEffect(() => {
  if (!buy || !sell || !cow.value || !provider.value) {
    return;
  }

  const params = createParams(buy, sell, level);

  if (!cowHandler) {
    cowHandler = createCowSwapWidget(cow.value, {
      params,
      provider: provider.value as unknown as EthereumProvider,
    });
    return;
  }

  cowHandler.updateParams(params);
});

function createParams(
  buy: string,
  sell: string,
  level: number
): CowSwapWidgetParams {
  return {
    appCode: "Llama Airforce",
    width: "100%",
    height: "520px",
    chainId: 1,
    tokenLists: [
      "https://files.cow.fi/tokens/CoinGecko.json",
      "https://files.cow.fi/tokens/CowSwap.json",
    ],
    tradeType: TradeType.SWAP,
    sell: { asset: sell, amount: "0" },
    buy: { asset: buy, amount: "0" },
    enabledTradeTypes: [TradeType.SWAP],
    theme: {
      baseTheme: "dark",
      primary: "#18181b",
      background: "#18181b",
      paper: level === 1 ? "#18181b" : "#27272a",
      text: "#fafafa",
      danger: "#ff5757",
      warning: "#ffcc00",
      alert: "#ffcc00",
      info: "#2081f0",
      success: "#7ed957",
    },
    customTokens: [
      {
        chainId: 1,
        address: "0x34635280737b5BFe6c7DC2FC3065D60d66e78185",
        name: "Convex Prisma",
        decimals: 18,
        symbol: "cvxPRISMA",
        logoURI:
          "https://assets.coingecko.com/coins/images/32961/large/cvxprisma.png?1700026172",
      },
    ],
    standaloneMode: false,
    disableToastMessages: false,
  };
}
</script>

<template>
  <div
    ref="cow"
    class="cow"
  ></div>
</template>

<style lang="scss" scoped>
.cow {
  color-scheme: initial;
}
</style>
