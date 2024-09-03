<script setup lang="ts">
import { type Chain, chainIcon } from "@CM/Models";

type SelectItem = {
  label: string;
};

type ChainInfo = SelectItem & {
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

// Emits
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
  ].filter((chainInfo) => chains.includes(chainInfo.chain as Chain))
);

const chainSelected = computed(
  () => chainInfos.value.find((p) => p.chain === chain) ?? chainInfos.value[0]
);

const label = (item: SelectItem): string => item.label;

const onChainSelect = (option: ChainInfo): void => {
  emit("select-chain", option.chain);
};
</script>

<template>
  <Select
    :options="chainInfos"
    :selected="chainSelected"
    @input="onChainSelect"
  >
    <template #item="{ item }">
      <div class="item">
        <img
          v-if="chainIcon(item.chain)"
          :src="chainIcon(item.chain)"
        />
        <div
          v-else
          class="empty"
        ></div>

        <div class="label">{{ label(item) }}</div>
      </div>
    </template>
  </Select>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.item {
  display: flex;
  align-items: center;

  img,
  .empty {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}
</style>
