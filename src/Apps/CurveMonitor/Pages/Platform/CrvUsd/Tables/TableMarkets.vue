<script setup lang="ts">
import type { Market } from "@CM/Services/CrvUsd";
import { useQueryMarkets } from "@CM/Services/CrvUsd/Queries";

const emit = defineEmits<{
  select: [market: Market];
}>();

// Refs
const search = ref("");

const rows = computed(() =>
  markets.value
    .filter((market) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(market.name) || includesTerm(market.address);
    })
    .orderBy((x) => x.borrowed, "desc")
);

// Data
const { isFetching: loading, data: markets } = useQueryMarkets();

// Methods
const decimals = (x: number): number => (x >= 1_000_000 ? 2 : 0);
</script>

<template>
  <Card
    class="markets-card"
    title="Markets"
    :loading
  >
    <template #actions>
      <InputText
        v-model="search"
        search
        placeholder="Search for..."
      />
    </template>

    <Table
      class="markets-table"
      :rows
      :columns="[
        '',
        '',
        'Name',
        { label: 'Loans', align: 'end' },
        { label: 'Rate', align: 'end' },
        { label: 'Borrowed', align: 'end' },
        { label: 'Collateral', align: 'end' },
        { label: 'Fees Pending', align: 'end' },
        { label: 'Fees Collected', align: 'end' },
      ]"
      @select="emit('select', $event)"
    >
      <template #row="{ item }">
        <IconExpander />

        <TokenIcon
          chain="ethereum"
          :address="item.collateral_token.address"
        />

        <div>{{ item.name }}</div>
        <div class="end">{{ item.loans }}</div>

        <div class="end">
          <AsyncValue
            type="percentage"
            :value="item.rate * 100"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.borrowed"
            :precision="decimals"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.collateralUsd"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.fees.pending"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.fees.collected"
            :precision="decimals"
          />
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>
        <div></div>
        <div class="end">{{ rows.reduce((acc, x) => acc + x.loans, 0) }}</div>
        <div></div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.borrowed, 0)"
            :precision="decimals"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.collateralUsd, 0)"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.fees.pending, 0)"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.fees.collected, 0)"
            :precision="decimals"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.markets-card {
  --header-column-title: minmax(7rem, 1fr);
  --header-column-actions: minmax(auto, 25rem);
}

.markets-table {
  --col-width: 11ch;
  --columns-data: 1rem 26px minmax(12ch, 1fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr);
}
</style>
