<script setup lang="ts">
import { useUnionStore } from "@Pounders/Store";
import { type PounderId, type Fees, getFees } from "@Pounders/Models";
import Pool from "@Pounders/Components/Pool.vue";
import Balance from "@Pounders/Components/Balance.vue";
import Apy from "@Pounders/Components/Apy.vue";
import Tvl from "@Pounders/Components/Tvl.vue";

const { pounderId } = defineProps<{
  pounderId: PounderId;
  expanded: boolean;
}>();

const emit = defineEmits<{
  toggleExpand: [];
}>();

// Refs
const store = useUnionStore();

const pounderStore = computed(() => store.pounders[pounderId]!);
const pounder = computed(() => pounderStore.value.pounder);
const state = computed(() => pounderStore.value.state);

// Fees
const fees = ref<Fees | undefined>(undefined);
const getFeesTrigger = ref(false);

whenever(getFeesTrigger, async () => {
  fees.value = await getFees(pounder.value.contract);
});
</script>

<template>
  <div
    class="row"
    @click="emit('toggleExpand')"
  >
    <Pool
      class="pounder-item"
      :name="pounder.name"
      :logo="pounder.logo"
      :symbol="pounder.symbol"
      :price-underlying="state.priceUnderlying"
    >
    </Pool>

    <Balance
      class="pounder-item"
      :symbol="pounder.symbol"
      :state="state"
    ></Balance>

    <Apy
      class="pounder-item"
      :apy="state.apy"
      :fees
      @show="getFeesTrigger = true"
    ></Apy>

    <Tvl
      class="pounder-item"
      :state="state"
    ></Tvl>

    <div
      class="pounder-item expander"
      :class="{ expanded }"
    >
      <i class="fas fa-chevron-up"></i>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  margin: 1rem 2rem;

  @media only screen and (max-width: 800px) {
    grid-template-columns: auto 1fr 1fr 1fr auto;
  }

  > .expander {
    transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
    transform: rotate(90deg);

    &.expanded {
      transform: rotate(180deg);
    }
  }
}
</style>

<style>
.pounder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.5rem;

  > .label {
    color: #a1a1aa;
    font-size: 0.75rem;
  }

  > .value {
    color: white;
    font-size: 1.25rem;
    font-weight: bold;

    @media only screen and (max-width: 400px) {
      font-size: 1rem;
    }

    .value-tooltip {
      border-bottom: dotted 2px
        hsl(from var(--c-lvl3) h s calc(l + 12 * var(--color-scheme-dark)));
    }

    .tooltip .content {
      display: flex;
      gap: 1rem;
      padding: 1rem;

      .fees,
      .underlying {
        padding: 0;
        margin: 0;

        li {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 20ch;
          gap: 0.5rem;

          div:first-child {
            font-weight: bold;
          }

          div:nth-child(2) {
            justify-self: end;
          }
        }
      }
    }
  }
}
</style>
