<template>
  <div class="pools">
    <div class="dashboard">
      <SearchPool
        v-model="pool"
        class="select-pool"
        @select="onSelect"
      ></SearchPool>

      <div
        class="volumes"
        :class="{ loading: store.poolsLoading }"
      >
        <GraphVolume
          v-if="poolSelected"
          class="graph-volumes"
          :pool-selected="poolSelected"
        ></GraphVolume>

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
import VolumeService from "@/Pages/Curve/Volume/Services/VolumeService";
import { useCurveStore } from "@/Pages/Curve/Store";
import SearchPool from "@/Pages/Curve/Components/SearchPool.vue";
import GraphVolume from "@/Pages/Curve/Volume/Components/GraphVolume.vue";
import { getHost } from "@/Services/Host";

const poolService = new PoolService(getHost());
const volumeService = new VolumeService(getHost());

// Refs
const store = useCurveStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);

onMounted(async (): Promise<void> => {
  await store.loadPools(poolService);
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
  store.poolsLoading = true;

  try {
    const volumes = await minDelay(volumeService.get(pool), 500);

    if (volumes) {
      store.setVolumes(pool.id, volumes);
    }
  } finally {
    store.poolsLoading = false;
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
