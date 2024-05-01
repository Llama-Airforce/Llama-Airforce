<template>
  <DataTable
    class="datatable-markets"
    columns-header="1fr 14rem minmax(auto, 25rem)"
    columns-data="markets-columns-data"
    expand-side="left"
    :loading="loading"
    :rows="rows"
    :columns="['', 'Name', 'Borrow Rate', 'Lend Rate', 'Loans']"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <SelectChain
        class="chain-select"
        :chain="networkChain"
        :all="true"
        @select-chain="networkChain = $event === 'all' ? 'mainnet' : $event"
      ></SelectChain>

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
      <div class="number">
        <AsyncValue
          :value="props.item.borrowRate"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.lendRate"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">{{ props.item.numLoans }}</div>

      <!--
        <div class="number">
        <AsyncValue
          :value="tvl(props.item)"
          :precision="decimals"
          :show-symbol="false"
          type="dollar"
        />
        </div> -->
    </template>

    <template #row-aggregation>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="number">
        {{ rows.reduce((acc, x) => acc + x.numLoans, 0) }}
      </div>
      <!--       <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + tvl(x), 0)"
          :precision="decimals"
          :show-symbol="false"
          type="dollar"
        />
      </div> -->
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue, DataTable, InputText, usePromise } from "@/Framework";
import { getHost } from "@/Services/Host";
import SelectChain from "@CM/Components/SelectChain.vue";
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";
import LlamaLendService from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendService";

const { t } = useI18n();

const curveService = new LlamaLendService(getHost());

type Row = Market;

// Refs
const search = ref("");
const networkChain = ref<Chain>("mainnet");

const rows = computed((): Row[] =>
  chain(rowsRaw.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.name);
    })
    .value()
);

// Data
const {
  load,
  loading,
  data: rowsRaw,
} = usePromise(
  () =>
    curveService
      .getMarkets(networkChain.value)
      .then((markets) => markets.sort((a, b) => tvl(b) - tvl(a))),
  []
);

// Watches
watch(networkChain, load);

// Methods
const tvl = (x: Market) => x.totalAssets + x.collateralBalance * x.priceOracle;
/* const decimals = (x: number): number => (x >= 1_000_000 ? 2 : 0); */
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-markets {
  container-type: inline-size;

  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  .chain-select {
    margin-left: 1rem;
  }

  ::v-deep(.markets-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns:
      1rem
      minmax(12ch, 1fr)
      minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.75fr);

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Markets

search-placeholder: Search for...
</i18n>
