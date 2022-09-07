<template>
  <div class="system-selector">
    <KPI
      class="chain"
      label=""
      tabindex="0"
      :has-value="!!chain"
      @click.stop="onChainOpen"
      @blur="chainOpen = false"
    >
      <Select
        class="select"
        :options="chains"
        :selected="chain"
        :open="chainOpen"
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

      <div class="selector">
        <i class="fas fa-chevron-up"></i>
        <i class="fas fa-chevron-down"></i>
      </div>
    </KPI>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { onMounted } from "vue";
import { $ref, $computed } from "vue/macros";
import KPI from "@/Framework/KPI.vue";
import Select from "@/Framework/Select.vue";
import { useCurveStore } from "@/Pages/Curve/Store";
import { Chain } from "@/Pages/Curve/Revenue/Models/Chain";

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

let chainOpen = $ref(false);

let chainSelected = $ref(false);

const chains = $computed((): ChainInfo[] => {
  return [
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
});

const chain = $computed((): ChainInfo | null => {
  return chains.find((p) => p.chain === store.selectedChain) ?? null;
});

// Hooks
onMounted((): void => {
  onChainSelect(chains[0]);

  chainSelected = false;
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
  if (chainSelected) {
    chainSelected = false;
    return;
  }

  chainOpen = !chainOpen;
};

const onChainSelect = (option: unknown): void => {
  const { chain } = option as ChainInfo;
  chainOpen = false;
  chainSelected = true;
  emit("select-chain", chain);
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.system-selector {
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  gap: 1.5rem;

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr;

    > .chain {
      grid-row: 1;
      grid-column: 1;
    }
  }

  .chain {
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
    transition: background $hover-duration;

    background: lighten($background-color-widget, 6%);
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

    &:hover {
      background: lighten($background-color-widget, 12%);
    }

    ::v-deep(.select) {
      > .items {
        width: 105%;
      }

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

    .selector {
      position: absolute;
      display: flex;
      flex-direction: column;
      font-size: 0.75rem;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
