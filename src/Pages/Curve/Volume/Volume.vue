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
        class="volumes"
        :class="{ loading }"
      >
        <GraphVolume
          v-if="poolSelected"
          class="graph-volumes"
          :pool-selected="poolSelected"
        ></GraphVolume>

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
import VolumeService from "@/Pages/Curve/Volume/Services/VolumeService";
import { useCurveStore } from "@/Pages/Curve/Store";
import SearchPool from "@/Pages/Curve/Components/SearchPool.vue";
import GraphVolume from "@/Pages/Curve/Volume/Components/GraphVolume.vue";
import { getHost } from "@/Services/Host";

const poolService = new PoolService(getHost());
const volumeService = new VolumeService(getHost());

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
});

onBeforeUnmount((): void => {
  isMounted = false;
});

// Events
const getVolumes = async (pool?: Pool): Promise<void> => {
  if (!pool) {
    return;
  }

  // Don't request new volumes if there's already cached.
  if (store.volumes[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  loading = true;

  try {
    const volumes = await minDelay(volumeService.get(pool), 500);

    if (volumes) {
      store.setVolumes(pool.id, volumes);
    }
  } finally {
    loading = false;
  }
};

const toggleExpansion = (newPool: Pool): void => {
  pool = shorten(newPool.name);
  poolSelected = newPool;

  void getVolumes(newPool);
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

    .volumes {
      position: relative;
      grid-column: 1;
      grid-row: 2;

      display: grid;
      grid-template-rows: 400px;
      gap: 1rem;

      .graph-volumes {
        grid-row: 1;
      }

      &.loading {
        .graph-volumes {
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
