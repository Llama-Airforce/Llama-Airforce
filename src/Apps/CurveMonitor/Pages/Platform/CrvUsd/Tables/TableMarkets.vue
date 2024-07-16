<template>
  <DataTable
    class="datatable-markets"
    expand-side="left"
    :loading
    :rows
    :columns="[
      '',
      'Name',
      'Loans',
      'Rate',
      'Borrowed',
      'Collateral',
      'Fees Pending',
      'Fees Collected',
    ]"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template #row="props: { item: Row }">
      <div>{{ props.item.name }}</div>
      <div class="number">{{ props.item.loans }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.rate * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.borrowed"
          :precision="decimals"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.collateralUsd"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.fees.pending"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.fees.collected"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>
      <div></div>
      <div class="number">{{ rows.reduce((acc, x) => acc + x.loans, 0) }}</div>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.borrowed, 0)"
          :precision="decimals"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.collateralUsd, 0)"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.fees.pending, 0)"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.fees.collected, 0)"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { type Market } from "@CM/Services/CrvUsd";
import { useQueryMarkets } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

type Row = Market;

// Refs
const search = ref("");

const rows = computed((): Row[] =>
  chain(markets.value)
    .filter((market) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(market.name) || includesTerm(market.address);
    })
    .orderBy((x) => x.borrowed, "desc")
    .value()
);

// Data
const { isFetching: loading, data: markets } = useQueryMarkets();

const decimals = (x: number): number => (x >= 1_000_000 ? 2 : 0);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-markets {
  --columns-header: minmax(7rem, 1fr) minmax(auto, 25rem);

  --col-width: 11ch;
  --columns-data: 1rem minmax(12ch, 1fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr);

  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  :deep(.row-data) {
    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6),
    div:nth-child(7),
    div:nth-child(8) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Markets

search-placeholder: Search for...
</i18n>
