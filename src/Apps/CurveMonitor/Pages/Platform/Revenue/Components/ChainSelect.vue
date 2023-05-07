<template>
  <Select
    class="select"
    :options="chains"
    :selected="chain"
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
        <img :src="icon(props.item)" />
        <div class="label">{{ label(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Select } from "@/Framework";
import { useCurveStore } from "@CM/Pages/Platform/Store";
import { Chain } from "@CM/Pages/Platform/Revenue/Models/Chain";

type SelectItem = {
  label: string;
  logo: string;
};

type ChainInfo = SelectItem & {
  chain: Chain;
};

// Emits
const emit = defineEmits<{
  (e: "select-chain", chain: Chain): void;
}>();

// Refs
const store = useCurveStore();

const chainOpen = ref(false);

const chains: ChainInfo[] = [
  { chain: "mainnet", label: "Ethereum", logo: "mainnet.svg" },
  { chain: "avalanche", label: "Avalanche", logo: "avalanche.svg" },
  { chain: "arbitrum", label: "Arbitrum", logo: "arbitrum.png" },
  { chain: "fantom", label: "Fantom", logo: "fantom.svg" },
  { chain: "xdai", label: "Gnosis (xDai)", logo: "xdai.png" },
  { chain: "harmony", label: "Harmony", logo: "harmony.svg" },
  { chain: "moonbeam", label: "Moonbeam", logo: "moonbeam.png" },
  { chain: "matic", label: "Polygon", logo: "matic.svg" },
  { chain: "optimism", label: "Optimism", logo: "optimism.png" },
];

const chain = computed((): ChainInfo | null => {
  return chains.find((p) => p.chain === store.selectedChain) ?? null;
});

// Hooks
onMounted((): void => {
  onChainSelect(chains[0]);
});

// Methods
const label = (item: SelectItem): string => {
  return item.label;
};

const icon = (item: SelectItem): string => {
  return `icons/chains/${item.logo}`;
};

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

    img {
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
