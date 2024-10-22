<script setup lang="ts">
import SelectChain from "@CM/Components/SelectChain.vue";
import { type Chain } from "@CM/Models";
import { useQueryCushions } from "@CM/Services/Revenue/Queries";
import { useQueryChainsSupported } from "@CM/Services/Chains/Queries";

// Refs
const search = ref("");
const loading = computed(
  () => isLoadingChains.value || isLoadingCushions.value
);

// Chains
const networkChain = ref<Chain>("ethereum");

const { data: chains, isFetching: isLoadingChains } = useQueryChainsSupported();

// Data
const rows = computed(() =>
  rowsRaw.value
    .filter((row) => row.usdValue > 100)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.pool) || includesTerm(row.name);
    })
);

const { data: rowsRaw, isFetching: isLoadingCushions } =
  useQueryCushions(networkChain);

const linkAddress = (addr: string): string => {
  return `https://etherscan.io/address/${addr}`;
};
</script>

<template>
  <Card
    class="cushions-card"
    title="Cushions"
    :loading
  >
    <template #actions>
      <SelectChain
        class="chain-select"
        :chain="networkChain"
        :chains
        @select-chain="networkChain = $event === 'all' ? 'ethereum' : $event"
      />

      <InputText
        v-model="search"
        search
        placeholder="Search for..."
      />
    </template>

    <Table
      class="cushions-table"
      :rows
      :columns="['Name', 'Address', { label: 'Fees ($)', align: 'end' }]"
    >
      <template #row="{ item }">
        <div>{{ item.name }}</div>

        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="linkAddress(item.pool)"
          >
            {{ item.pool }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.usdValue"
            :precision="2"
          />
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.usdValue, 0)"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.cushions-card {
  --header-column-actions: 14rem minmax(auto, 25rem);
}

.cushions-table {
  --columns-data: 1fr 25rem 10rem;

  .chain {
    display: flex;
    gap: 1rem;
    text-transform: capitalize;

    @media only screen and (max-width: 1280px) {
      justify-content: center;

      .label {
        display: none;
      }
    }
  }
}
</style>
