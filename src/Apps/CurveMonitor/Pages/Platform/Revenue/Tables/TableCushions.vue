<template>
  <Card :title="t('title')">
    <template #actions>
      <SelectChain
        class="chain-select"
        :chain="networkChain"
        :chains
        @select-chain="networkChain = $event === 'all' ? 'ethereum' : $event"
      ></SelectChain>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <DataTable
      class="distributions-table"
      :loading
      :rows
      :columns="['Name', 'Address', { label: 'Fees ($)', align: 'end' }]"
    >
      <template #row="props: { item: Row }">
        <div>{{ props.item.name }}</div>

        <div>
          <a
            class="font-mono"
            :href="linkAddress(props.item.pool)"
            target="_blank"
          >
            {{ props.item.pool }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            :value="props.item.usdValue"
            :precision="2"
            type="dollar"
          />
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            :value="rows.reduce((acc, x) => acc + x.usdValue, 0)"
            :precision="2"
            type="dollar"
          />
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import SelectChain from "@CM/Components/SelectChain.vue";
import { type Chain } from "@CM/Models/Chain";
import { type Cushion } from "@CM/Services/Revenue";
import { useQueryCushions } from "@CM/Services/Revenue/Queries";
import { useQueryChainsSupported } from "@CM/Services/Chains/Queries";

const { t } = useI18n();

type Row = Cushion;

// Refs
const search = ref("");
const loading = computed(
  () => isLoadingChains.value || isLoadingCushions.value
);

// Chains
const networkChain = ref<Chain>("ethereum");

const { data: chains, isFetching: isLoadingChains } = useQueryChainsSupported();

// Data
const rows = computed((): Row[] =>
  chain(rowsRaw.value)
    .filter((row) => row.usdValue > 100)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.pool) || includesTerm(row.name);
    })
    .value()
);

const { data: rowsRaw, isFetching: isLoadingCushions } =
  useQueryCushions(networkChain);

const linkAddress = (addr: string): string => {
  return `https://etherscan.io/address/${addr}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.search {
  margin-left: 1rem;
}

.chain-select {
  margin-left: 1rem;
}

.distributions-table {
  --columns-header: 1fr 14rem minmax(auto, 25rem);
  --columns-data: 1fr 25rem 10rem;

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
}
</style>

<i18n lang="yaml" locale="en">
title: Cushions

search-placeholder: Search for...
</i18n>
