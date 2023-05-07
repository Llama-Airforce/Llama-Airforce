<template>
  <DataTable
    class="datatable-sandwiches"
    columns-header="auto 1fr auto"
    columns-data="sandwiches-columns-data"
    :rows="sandwichesPage"
    :columns="['Block', 'Profit', 'Loss', 'Time']"
    :expanded="expanded"
    @selected="onSelected"
  >
    <template #header-title>
      <div class="title">{{ t("title") }}</div>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template
      v-if="sandwiches.length > swsPerPage"
      #header-actions
    >
      <Pagination
        class="pagination"
        :items-count="sandwiches.length"
        :items-per-page="swsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Sandwich }">
      <div class="number">
        <a
          class="vote-link"
          :href="`https://etherscan.io/block/${props.item.blockNumber}`"
          target="_blank"
        >
          {{ props.item.blockNumber }}
        </a>
      </div>

      <div class="number">
        <span>
          {{ props.item.profit.toLocaleString() }}
          {{ props.item.profitUnit }}
        </span>
      </div>

      <div class="number">
        <span>
          {{ props.item.loss.toLocaleString() }}
          {{ props.item.lossUnit }}
        </span>
      </div>

      <div class="number">
        {{ relativeTime(props.item.timestamp) }}
      </div>
    </template>

    <template #row-details="props: { item: Sandwich }">
      <Transactions
        class="transactions"
        :txs="props.item.txs"
        :header="false"
        :compact="true"
        :time="false"
      ></Transactions>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { DataTable, InputText, Pagination } from "@/Framework";
import Transactions from "@CM/Pages/Pool/Components/Transactions.vue";
import type { Sandwich } from "@CM/Pages/Pool/Models";
import { useCurveMonitorStore } from "@CM/Store";
import { relativeTime as relativeTimeFunc } from "@CM/Util";

const { t } = useI18n();

const swsPerPage = 6;

// Refs
const store = useCurveMonitorStore();

const search = ref("");
const page = ref(1);
const expanded = ref<Sandwich[]>([]);
const now = ref(Date.now());

const sandwiches = computed((): Sandwich[] =>
  chain(store.sandwiches)
    .filter((tx) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(tx.blockNumber.toString());
    })
    .reverse() // Server gives us the data in order already, just reversed.
    .value()
);

const sandwichesPage = computed((): Sandwich[] =>
  chain(sandwiches.value)
    .drop((page.value - 1) * swsPerPage)
    .take(swsPerPage)
    .value()
);

// Hooks
onMounted(() => {
  setInterval(() => {
    now.value = Date.now();
  });
});

// Methods
const relativeTime = (unixtime: number): string => {
  return relativeTimeFunc(now, unixtime);
};

const toggleExpansion = (sw: Sandwich): boolean => {
  if (!expanded.value.includes(sw)) {
    expanded.value.push(sw);
    return true;
  } else {
    expanded.value = expanded.value.filter((x) => x !== sw);
    return false;
  }
};

// Events
const onPage = (pageNew: number) => {
  page.value = pageNew;
};

const onSelected = (data: unknown): void => {
  const sw = data as Sandwich;
  toggleExpansion(sw);
};

// Watches
watch(sandwichesPage, (ps) => {
  if (ps.length === 0) {
    page.value = Math.max(1, Math.ceil(sandwiches.value.length / swsPerPage));
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-sandwiches {
  .title {
    margin-right: 1rem;
  }

  ::v-deep(.pagination) {
    li {
      button {
        height: 2rem;
        width: 2rem;
      }
    }
  }

  .search {
    font-size: 0.875rem;
    width: 600px;
    justify-self: end;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-right: 2rem;

    @media only screen and (max-width: 1280px) {
      width: auto;
    }
  }

  ::v-deep(.sandwiches-columns-data) {
    display: grid;
    grid-column-gap: 2.5rem;
    grid-template-columns: 4rem 1fr 1fr 2fr 1rem;

    // Right adjust number columns.
    div:nth-child(1),
    div:nth-child(2),
    div:nth-child(4),
    div:nth-child(3) {
      justify-content: end;
    }
  }

  ::v-deep(.transactions) {
    .row-data {
      border-bottom-width: 0;
      background-color: var(--container-background-hint);
    }
  }

  ::v-deep(.collapsible-outside) {
    transition: grid-template-rows 200ms ease-out;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Sandwiches
search-placeholder: Search for...
</i18n>
