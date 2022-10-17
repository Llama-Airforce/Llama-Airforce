<template>
  <div class="fraxmatch">
    <div class="dashboard">
      <InputText
        v-model="pool"
        class="select-pool"
        :search="true"
        :auto-complete="autoComplete"
        :options="pools"
        :filter="filter"
        @input="onInput"
        @select="onSelect"
      >
        <template #item="props: { item: Pool }">
          <div
            v-if="props.item"
            class="item"
          >
            <div class="label">{{ props.item.name }}</div>
          </div>
        </template>
      </InputText>

      <Summary class="summary"></Summary>
      <GraphMatch class="graph"></GraphMatch>
      <TableMatch class="table"></TableMatch>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { $ref, $computed } from "vue/macros";
import InputText from "@/Framework/InputText.vue";
import Summary from "@/Pages/Bribes/FraxMatch/Components/Summary.vue";
import GraphMatch from "@/Pages/Bribes/FraxMatch/Components/GraphMatch.vue";
import TableMatch from "@/Pages/Bribes/FraxMatch/Components/TableMatch.vue";
import Pool from "@/Pages/Curve/Models/Pool";
import { match } from "@/Pages/Curve/Util/PoolHelper";
import { shorten } from "@/Util/PoolHelper";

// Refs
let pool = $ref("");
let autoComplete = $ref(false);

const pools: Pool[] = [
  {
    id: "ApeUSD+crvFRAX (0x04b7…)",
    name: "ApeUSD+crvFRAX (0x04b7…)",
    symbol: "ApeUSD+crvFRAX (0x04b7…)",
    cumulateVolumeUsd: 0,
    coins: [],
  },
  {
    id: "DOLA+crvFRAX (0xE571…)",
    name: "DOLA+crvFRAX (0xE571…)",
    symbol: "DOLA+crvFRAX (0xE571…)",
    cumulateVolumeUsd: 0,
    coins: [],
  },
  {
    id: "DOLA+crvFRAX (0xE571…)",
    name: "DOLA+crvFRAX (0xE571…)",
    symbol: "DOLA+crvFRAX (0xE571…)",
    cumulateVolumeUsd: 0,
    coins: [],
  },
];

const filter = $computed(() => {
  return (input: string, option: unknown) => match(input, option as Pool);
});

// Events
const onInput = (input: string): void => {
  autoComplete = !!input;
};

const toggleExpansion = (newPool: Pool): void => {
  pool = shorten(newPool.name);
  autoComplete = false;
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  toggleExpansion(pool);
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.fraxmatch {
  display: flex;
  justify-content: center;

  .dashboard {
    padding: $page-margin;
    width: 100%;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: auto auto 1fr 1fr;
    grid-template-columns: 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .select-pool {
      grid-column: 1;
      grid-row: 1;
    }

    .summary {
      grid-column: 1;
      grid-row: 2;
    }

    .graph {
      grid-column: 1;
      grid-row: 3;

      height: 370px;
    }

    .table {
      max-height: 420px;

      grid-column: 1;
      grid-row: 4;
    }
  }
}
</style>
