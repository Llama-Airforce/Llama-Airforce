<template>
  <div class="pools">
    <div class="dashboard">
      <InputText
        v-model="pool"
        class="select-pool"
        :placeholder="placeholder"
        :search="true"
        :auto-complete="autoComplete"
        :options="pools"
        :filter="filter"
        :sort="sort"
        @input="onInput"
        @select="onSelect"
      >
        <template #item="props: { item: Pool, idx: number }">
          <div
            v-if="props.item"
            class="item"
          >
            <img :src="icon(props.item.name, false)" />
            <div class="label">{{ name(props.item) }}</div>
            <div
              v-if="props.idx === 0"
              class="description"
            >
              {{ t("search-description") }}
            </div>
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
          v-if="poolSelected"
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

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { AsyncValue, InputText, Spinner } from "@/Framework";
import { shorten, icon, minDelay } from "@/Util";
import Pool from "@/Pages/Curve/Models/Pool";
import PoolService from "@/Pages/Curve/Services/PoolService";
import CandleService from "@/Pages/Curve/Prices/Services/CandleService";
import { useCurveStore } from "@/Pages/Curve/Store";
import { match } from "@/Pages/Curve/Util/PoolHelper";
import GraphCandles from "@/Pages/Curve/Prices/Components/GraphCandles.vue";
import { getHost } from "@/Services/Host";

const poolService = new PoolService(getHost());
const candleService = new CandleService(getHost());

let isMounted = false;

const { t } = useI18n();

// Refs
const store = useCurveStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);
let autoComplete = $ref(false);
let loading = $ref(false);
let placeholder = $ref(t("search-loading"));

// Hooks
onMounted(async (): Promise<void> => {
  isMounted = true;

  // Don't request new pools if there's already cached.
  if (store.pools.length > 0) {
    placeholder = t("search-placeholder");
    return;
  }

  const resp = await minDelay(poolService.get());

  if (resp) {
    store.pools = resp;
    placeholder = t("search-placeholder");

    /*
     * Select first pool by default if none given by the URL.
     * It's possible the component has unmounted before we arrive here.
     */
    if (!isMounted) {
      return;
    }
  } else {
    placeholder = t("search-error");
  }
});

onBeforeUnmount((): void => {
  isMounted = false;
});

const pools = $computed((): Pool[] => {
  return store.pools;
});

// Methods
const filter = (input: string, option: unknown) => match(input, option as Pool);
const sort = (a: unknown, b: unknown) => volume(b as Pool) - volume(a as Pool);

const volume = (pool: Pool): number => {
  return pool.cumulateVolumeUsd;
};

const name = (pool: Pool): string => {
  const nameShort = shorten(pool.name);
  const nameTrimmed =
    nameShort.substring(0, 9) === "Curve.fi " ? nameShort.slice(9) : nameShort;

  return nameTrimmed;
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pools");

.pools {
  .dashboard {
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

        > .volume,
        > .description {
          font-size: 0.875rem;
          margin-left: 0.75rem;
        }

        > .description {
          color: $level5-color;
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

<i18n lang="yaml" locale="en">
search-loading: Loading pools, please wait...
search-placeholder: Search for Curve pools
search-error: Failed loading Curve pools
search-description: Cumulative Volume
</i18n>
