<template>
  <div class="pools">
    <div class="dashboard">
      <SearchPool
        v-model="pool"
        class="select-pool"
        :loading="loading"
        :error="error"
        @select="onSelect"
      ></SearchPool>

      <div
        class="reserves"
        :class="{ loading }"
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
          v-if="loading"
          class="spinner"
        ></Spinner>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
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

let isMounted = false;

// Refs
const store = useCurveStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);
let loading = $ref(false);
let error = $ref(false);

onMounted(async (): Promise<void> => {
  isMounted = true;

  // Don't request new pools if there's already cached.
  if (store.pools.length > 0) {
    loading = false;
    return;
  }

  loading = true;
  const resp = await minDelay(poolService.get());

  if (resp) {
    store.pools = resp;
    loading = false;

    /*
     * Select first pool by default if none given by the URL.
     * It's possible the component has unmounted before we arrive here.
     */
    if (!isMounted) {
      return;
    }
  } else {
    error = true;
  }

  loading = false;
  isMounted = false;
});

onBeforeUnmount((): void => {
  isMounted = false;
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
  loading = true;

  try {
    const reserves = await minDelay(reservesSerice.get(pool), 500);

    if (reserves) {
      store.setReserves(pool.id, reserves);
    }
  } finally {
    loading = false;
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
