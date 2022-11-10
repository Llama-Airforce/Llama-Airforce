<template>
  <div class="pools">
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
            <img :src="icon(props.item.name, false)" />
            <div class="label">{{ shorten(props.item.name) }}</div>
            <div class="volume">
              <AsyncValue
                :value="volume(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
          </div>
        </template>
      </InputText>

      <div
        class="candles"
        :class="{ loading }"
      >
        <GraphCandles
          class="graph"
          :pool-selected="poolSelected"
        ></GraphCandles>

        <Spinner
          v-if="loading"
          class="spinner"
        ></Spinner>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { onMounted, onBeforeUnmount } from "vue";
import { $ref, $computed } from "vue/macros";
import Pool from "@/Pages/Curve/Models/Pool";
import PoolService from "@/Pages/Curve/Services/PoolService";
import CandleService from "@/Pages/Curve/Prices/Services/CandleService";
import { minDelay } from "@/Util/PromiseHelper";
import { useCurveStore } from "@/Pages/Curve/Store";
import { shorten, icon } from "@/Util/PoolHelper";
import { match } from "@/Pages/Curve/Util/PoolHelper";
import AsyncValue from "@/Framework/AsyncValue.vue";
import InputText from "@/Framework/InputText.vue";
import Spinner from "@/Framework/Spinner.vue";
import GraphCandles from "@/Pages/Curve/Prices/Components/GraphCandles.vue";
import { getHost } from "@/Services/Host";

const poolService = new PoolService(getHost());
const candleService = new CandleService(getHost());

let isMounted = false;

// Refs
const store = useCurveStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);
let autoComplete = $ref(false);
let loading = $ref(false);

// Hooks
onMounted(async (): Promise<void> => {
  isMounted = true;

  // Don't request new pools if there's already cached.
  if (store.pools.length > 0) {
    return;
  }

  const resp = await minDelay(poolService.get());
  if (resp) {
    store.pools = resp;

    /*
     * Select first pool by default if none given by the URL.
     * It's possible the component has unmounted before we arrive here.
     */
    if (!isMounted) {
      return;
    }
  }
});

onBeforeUnmount((): void => {
  isMounted = false;
});

const pools = $computed((): Pool[] => {
  return store.pools;
});

const filter = $computed(() => {
  return (input: string, option: unknown) => match(input, option as Pool);
});

// Methods
const volume = (pool: Pool): number => {
  return pool.cumulateVolumeUsd;
};

// Events
const onInput = (input: string): void => {
  autoComplete = !!input;
};

const getCandles = async (pool?: Pool): Promise<void> => {
  if (!pool) {
    return;
  }

  // Don't request new candles if there's already cached.
  if (store.candles[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  loading = true;

  try {
    const candles = await minDelay(candleService.get(pool), 500);

    if (candles) {
      store.setCandles(pool.id, candles);
    }
  } finally {
    loading = false;
  }
};

const toggleExpansion = (newPool: Pool): void => {
  pool = shorten(newPool.name);
  poolSelected = newPool;
  autoComplete = false;

  void getCandles(newPool);
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

.pools {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .select-pool {
      grid-column: 1;
      grid-row: 1;

      .item {
        display: flex;
        align-items: center;

        img {
          width: 20px;
          height: 20px;
          object-fit: scale-down;
        }

        > .label {
          flex-grow: 1;
          font-size: 0.875rem;
          margin-left: 0.75rem;
        }

        > .volume {
          font-size: 0.875rem;
          margin-left: 0.75rem;
        }
      }
    }

    .candles {
      position: relative;
      grid-column: 1;
      grid-row: 2;

      &.loading {
        .graph {
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
