<template>
  <Select
    class="select"
    :options="chainInfos"
    :selected="chainSelected"
    :open="chainOpen"
    @open="onChainOpen"
    @close="chainOpen = false"
    @input="onChainSelect"
  >
    <template #item="props: { item: ChainInfo }">
      <div
        v-if="props.item"
        class="item"
      >
        <img
          v-if="icon(props.item.chain)"
          :src="icon(props.item.chain)"
        />
        <div
          v-else
          class="empty"
        ></div>

        <div class="label">{{ label(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Select } from "@/Framework";
import { type Chain, icon } from "@CM/Models/Chain";

type SelectItem = {
  label: string;
};

type ChainInfo = SelectItem & {
  chain: Chain | "all";
};

// Props
interface Props {
  chain: Chain | "all" | null;
  chains?: Chain[];
  all?: boolean;
}

const { chain = null, chains = null, all = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "select-chain": [chain: Chain | "all"];
}>();

// Refs
const chainOpen = ref(false);

const chainInfos: ChainInfo[] = [
  ...(all ? [{ chain: "all" as const, label: "All" }] : []),
  { chain: "mainnet" as const, label: "Ethereum" },
  { chain: "avalanche" as const, label: "Avalanche" },
  { chain: "arbitrum" as const, label: "Arbitrum" },
  { chain: "fantom" as const, label: "Fantom" },
  { chain: "xdai" as const, label: "Gnosis (xDai)" },
  { chain: "harmony" as const, label: "Harmony" },
  { chain: "moonbeam" as const, label: "Moonbeam" },
  { chain: "matic" as const, label: "Polygon" },
  { chain: "optimism" as const, label: "Optimism" },
].filter((chainInfo) => !chains || chains.includes(chainInfo.chain as Chain));

const chainSelected = computed(
  (): ChainInfo | null => chainInfos.find((p) => p.chain === chain) ?? null
);

// Hooks
onMounted((): void => {
  onChainSelect(chainInfos[0]);
});

// Methods
const label = (item: SelectItem): string => item.label;

// Events
const onChainOpen = (): void => {
  chainOpen.value = !chainOpen.value;
};

const onChainSelect = (option: unknown): void => {
  const { chain } = option as ChainInfo;
  emit("select-chain", chain);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

::v-deep(.select) {
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
}
</style>
