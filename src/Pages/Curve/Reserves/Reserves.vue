<template>
  <div class="pools">
    <div class="dashboard">
      <SearchPool
        v-model="pool"
        class="select-pool"
        @select="onSelect"
      ></SearchPool>

      <div
        class="reserves"
        :class="{ loading: store.poolsLoading }"
      >
        <GraphReserves
          v-if="poolSelected"
          class="graph-reserves"
          :pool-selected="poolSelected"
        ></GraphReserves>

        <GraphBalances
          v-if="poolSelected"
          class="graph-balances"
          :pool-selected="poolSelected"
        ></GraphBalances>

        <Spinner
          v-if="store.poolsLoading"
          class="spinner"
        ></Spinner>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { $ref } from "vue/macros";
import { Spinner } from "@/Framework";
import { shorten, minDelay } from "@/Util";
import Pool from "@/Pages/Curve/Models/Pool";
import PoolService from "@/Pages/Curve/Services/PoolService";
import ReservesService from "@/Pages/Curve/Reserves/Services/ReservesService";
import { useCurveStore } from "@/Pages/Curve/Store";
import SearchPool from "@/Pages/Curve/Components/SearchPool.vue";
import GraphReserves from "@/Pages/Curve/Reserves/Components/GraphReserves.vue";
import GraphBalances from "@/Pages/Curve/Reserves/Components/GraphBalances.vue";
import { getHost } from "@/Services/Host";

const poolService = new PoolService(getHost());
const reservesSerice = new ReservesService(getHost());

// Refs
const store = useCurveStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);

onMounted(async (): Promise<void> => {
  await store.loadPools(poolService);
});

// Events
const getReserves = async (pool?: Pool): Promise<void> => {
  if (!pool) {
    return;
  }

  // Don't request new reserves if there's already cached.
  if (store.reserves[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    const reserves = await minDelay(reservesSerice.get(pool), 500);

    if (reserves) {
      store.setReserves(pool.id, reserves);
    }
  } finally {
    store.poolsLoading = false;
  }
};

const toggleExpansion = (newPool: Pool): void => {
  pool = shorten(newPool.name);
  poolSelected = newPool;

  void getReserves(newPool);
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  toggleExpansion(pool);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pools");

.pools {
  .dashboard {
    .select-pool {
      grid-column: 1;
      grid-row: 1;
    }

    .reserves {
      position: relative;
      grid-column: 1;
      grid-row: 2;

      display: grid;
      grid-template-rows: 400px 400px;
      gap: 1rem;

      .graph-reserves {
        grid-row: 1;
      }

      .graph-balances {
        grid-row: 2;
      }

      &.loading {
        .graph-reserves,
        .graph-balances {
          opacity: 0.5;
        }
      }

      .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
      }
    }
  }
}
</style>
