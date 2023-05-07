<template>
  <div class="fraxmatch">
    <div class="dashboard">
      <InputText
        v-model="pool"
        class="select-pool"
        :placeholder="placeholder"
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

      <Summary
        class="summary"
        :class="{ loading }"
        :epochs="epochs"
      ></Summary>

      <GraphMatch
        class="graph"
        :class="{ loading }"
        :epochs="epochs"
      ></GraphMatch>

      <TableMatch
        class="table"
        :class="{ loading }"
        :epochs="epochs"
      ></TableMatch>

      <Spinner
        v-if="loading"
        class="spinner"
      ></Spinner>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { InputText, Spinner } from "@/Framework";
import { shorten, minDelay } from "@/Util";
import Summary from "@LAF/Pages/Bribes/FraxMatch/Components/Summary.vue";
import GraphMatch from "@LAF/Pages/Bribes/FraxMatch/Components/GraphMatch.vue";
import TableMatch from "@LAF/Pages/Bribes/FraxMatch/Components/TableMatch.vue";
import type { Pool } from "@LAF/Pages/Bribes/FraxMatch/Models/Pool";
import { match } from "@LAF/Pages/Bribes/FraxMatch/Util/PoolHelper";
import { getHost } from "@/Services/Host";
import FraxMatchService from "@LAF/Pages/Bribes/FraxMatch/Services/FraxMatchService";
import type { EpochFrax } from "@LAF/Pages/Bribes/FraxMatch/Models/EpochFrax";

let isMounted = false;

const fraxMatchService = new FraxMatchService(getHost());

const { t } = useI18n();

// Refs
const pool = ref("");
const pools = ref<Pool[]>([]);
const epochs = ref<EpochFrax[]>([]);
const autoComplete = ref(false);
const loading = ref(false);
const placeholder = ref(t("search-loading"));

// Methods
const filter = (input: string, option: unknown) => match(input, option as Pool);

// Hooks
onMounted(async (): Promise<void> => {
  isMounted = true;
  const resp = await minDelay(fraxMatchService.getPools());

  if (resp) {
    pools.value = resp.pools;
    placeholder.value = t("search-placeholder");

    /*
     * Select first pool by default if none given by the URL.
     * It's possible the component has unmounted before we arrive here.
     */
    if (!isMounted) {
      return;
    }
  } else {
    placeholder.value = t("search-error");
  }
});

onBeforeUnmount((): void => {
  isMounted = false;
});

// Events
const onInput = (input: string): void => {
  autoComplete.value = !!input;
};

const getEpochs = async (pool?: Pool): Promise<void> => {
  if (!pool) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  loading.value = true;

  try {
    const resp = await minDelay(fraxMatchService.getEpochs(pool.id), 500);

    if (resp) {
      epochs.value = resp.epochs;
    }
  } finally {
    loading.value = false;
  }
};

const toggleExpansion = (newPool: Pool): void => {
  pool.value = shorten(newPool.name);
  autoComplete.value = false;

  void getEpochs(newPool);
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  toggleExpansion(pool);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("fraxmatch");
.fraxmatch {
  .dashboard {
    grid-template-rows: auto auto auto 1fr;

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

    .spinner {
      grid-column: 1;
      grid-row: 2 / span 3;
    }

    .loading {
      opacity: 0.5;
    }

    .spinner {
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
search-loading: Loading Frax pools with matches, please wait...
search-placeholder: Search for Frax pools with matches
search-error: Failed loading Frax pools with matches
</i18n>
