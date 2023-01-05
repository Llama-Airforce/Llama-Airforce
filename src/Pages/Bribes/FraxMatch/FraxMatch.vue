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
import { onMounted, onBeforeUnmount } from "vue";
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import InputText from "@/Framework/InputText.vue";
import Summary from "@/Pages/Bribes/FraxMatch/Components/Summary.vue";
import GraphMatch from "@/Pages/Bribes/FraxMatch/Components/GraphMatch.vue";
import TableMatch from "@/Pages/Bribes/FraxMatch/Components/TableMatch.vue";
import type { Pool } from "@/Pages/Bribes/FraxMatch/Models/Pool";
import { match } from "@/Pages/Bribes/FraxMatch/Util/PoolHelper";
import { shorten } from "@/Util/PoolHelper";
import { getHost } from "@/Services/Host";
import FraxMatchService from "@/Pages/Bribes/FraxMatch/Services/FraxMatchService";
import { minDelay } from "@/Util/PromiseHelper";
import type { EpochFrax } from "@/Pages/Bribes/FraxMatch/Models/EpochFrax";
import Spinner from "@/Framework/Spinner.vue";

let isMounted = false;

const fraxMatchService = new FraxMatchService(getHost());

const { t } = useI18n();

// Refs
let pool = $ref("");
let pools: Pool[] = $ref([]);
let epochs: EpochFrax[] = $ref([]);
let autoComplete = $ref(false);
let loading = $ref(false);
let placeholder = $ref(t("search-loading"));

// Methods
const filter = (input: string, option: unknown) => match(input, option as Pool);

// Hooks
onMounted(async (): Promise<void> => {
  isMounted = true;
  const resp = await minDelay(fraxMatchService.getPools());

  if (resp) {
    pools = resp.pools;
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

// Events
const onInput = (input: string): void => {
  autoComplete = !!input;
};

const getEpochs = async (pool?: Pool): Promise<void> => {
  if (!pool) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  loading = true;

  try {
    const resp = await minDelay(fraxMatchService.getEpochs(pool.id), 500);

    if (resp) {
      epochs = resp.epochs;
    }
  } finally {
    loading = false;
  }
};

const toggleExpansion = (newPool: Pool): void => {
  pool = shorten(newPool.name);
  autoComplete = false;

  void getEpochs(newPool);
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  toggleExpansion(pool);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("fraxmatch");
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
