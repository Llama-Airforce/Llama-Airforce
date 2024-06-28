<template>
  <DataTable
    class="datatable-distributions"
    columns-header="1fr 14rem minmax(auto, 25rem)"
    columns-data="cushions-columns-data"
    :loading
    :rows
    :columns="['Name', 'Coins', 'Chain', 'Fees ($)']"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <SelectChain
        class="chain-select"
        :chain="networkChain"
        :all="true"
        @select-chain="networkChain = $event"
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
      <div>{{ props.item.pool }}</div>
      <div>{{ props.item.coinNames.join(" / ") }}</div>
      <div class="chain">
        <img
          v-if="icon(props.item.chain)"
          :src="icon(props.item.chain)"
        />
        <span class="label">{{ props.item.chain }}</span>
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.totalUSD"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>
      <div></div>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.totalUSD, 0)"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import SelectChain from "@CM/Components/SelectChain.vue";
import { type Chain, icon } from "@CM/Models/Chain";
import { type Cushion } from "@CM/Services/Revenue";
import { useQueryCushions } from "@CM/Services/Revenue/Queries";

const { t } = useI18n();

type Row = Cushion;

// Refs
const search = ref("");
const networkChain = ref<Chain | "all">("all");

const rows = computed((): Row[] =>
  chain(rowsRaw.value)
    .filter((row) => row.totalUSD > 100)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      const isChainFilter =
        networkChain.value === "all" ? true : networkChain.value === row.chain;

      return (
        (includesTerm(row.pool) ||
          includesTerm(row.address) ||
          includesTerm(row.chain) ||
          includesTerm(row.coins.join(" "))) &&
        isChainFilter
      );
    })
    .value()
);

// Data
const { isFetching: loading, data: rowsRaw } = useQueryCushions();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-distributions {
  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  .chain-select {
    margin-left: 1rem;
  }

  .chain {
    display: flex;
    gap: 1rem;
    text-transform: capitalize;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    @media only screen and (max-width: 1280px) {
      justify-content: center;

      .label {
        display: none;
      }
    }
  }

  ::v-deep(.cushions-columns-data) {
    display: grid;
    grid-template-columns: 1fr 1fr 7rem 10rem;

    @media only screen and (max-width: 1280px) {
      grid-template-columns: 1fr 2.5rem 4rem;

      div:nth-child(2) {
        display: none;
      }
    }

    // Right adjust number columns.
    div:nth-child(4) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Cushions

search-placeholder: Search for...
</i18n>
