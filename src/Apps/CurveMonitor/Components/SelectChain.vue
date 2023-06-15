<template>
  <Select
    class="select"
    :options="chains"
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
  all?: boolean;
}

const { chain = null, all = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "select-chain": [chain: Chain | "all"];
}>();

// Refs
const chainOpen = ref(false);

const chains: ChainInfo[] = [
  ...(all ? [{ chain: "all" as const, label: "All" }] : []),
  { chain: "mainnet", label: "Ethereum" },
  { chain: "avalanche", label: "Avalanche" },
  { chain: "arbitrum", label: "Arbitrum" },
  { chain: "fantom", label: "Fantom" },
  { chain: "xdai", label: "Gnosis (xDai)" },
  { chain: "harmony", label: "Harmony" },
  { chain: "moonbeam", label: "Moonbeam" },
  { chain: "matic", label: "Polygon" },
  { chain: "optimism", label: "Optimism" },
];

const chainSelected = computed(
  (): ChainInfo | null => chains.find((p) => p.chain === chain) ?? null
);

// Hooks
onMounted((): void => {
  onChainSelect(chains[0]);
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
