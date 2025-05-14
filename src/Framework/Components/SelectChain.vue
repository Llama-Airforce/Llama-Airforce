<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";

type SelectOption = {
  label: string;
};

type ChainInfo = SelectOption & {
  chain: Chain | "all";
};

const {
  chain,
  chains,
  all = false,
} = defineProps<{
  chain: Chain | "all";
  chains: (Chain | "all")[];
  all?: boolean;
}>();

const emit = defineEmits<{
  "select-chain": [chain: Chain | "all"];
}>();

// Select
const chainInfos = computed(() =>
  [
    ...(all ? [{ chain: "all" as const, label: "All Chains" }] : []),
    { chain: "ethereum" as const, label: "Ethereum" },
    { chain: "avalanche" as const, label: "Avalanche" },
    { chain: "arbitrum" as const, label: "Arbitrum" },
    { chain: "fantom" as const, label: "Fantom" },
    { chain: "xdai" as const, label: "Gnosis (xDai)" },
    { chain: "harmony" as const, label: "Harmony" },
    { chain: "moonbeam" as const, label: "Moonbeam" },
    { chain: "matic" as const, label: "Polygon" },
    { chain: "optimism" as const, label: "Optimism" },
    { chain: "base" as const, label: "Base" },
    { chain: "polygon" as const, label: "Polygon" },
    { chain: "fraxtal" as const, label: "Fraxtal" },
    { chain: "sonic" as const, label: "Sonic" },
  ].filter((chainInfo) => chains.includes(chainInfo.chain as Chain))
);

const chainSelected = computed(
  () => chainInfos.value.find((p) => p.chain === chain) ?? chainInfos.value[0]
);

const label = (option: SelectOption): string => option.label;

const onChainSelect = (option: ChainInfo): void => {
  emit("select-chain", option.chain);
};
</script>

<template>
  <Select
    :options="chainInfos"
    :selected="chainSelected"
    @select="onChainSelect"
  >
    <template #option="{ option: { chain, ...option } }">
      <div class="option">
        <ChainIcon
          v-if="chain !== 'all'"
          :chain
        />
        <div
          v-else
          class="empty"
        ></div>
        <div class="label">{{ label(option) }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.option {
  display: flex;
  align-items: center;

  img,
  .empty {
    width: 20px;
  }

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}
</style>
