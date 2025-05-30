<script setup lang="ts">
import { useQueryMarkets } from "@CM/queries/crvusd";

const emit = defineEmits<{
  select: [market: ReturnType<typeof useQueryMarkets>["data"]["value"][number]];
}>();

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
          :address="item.collateralToken.address"
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
            :value="item.collateralAmountUsd"
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
        <div class="end">{{ rows.sumBy((x) => x.loans) }}</div>
        <div></div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.sumBy((x) => x.borrowed)"
            :precision="decimals"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.sumBy((x) => x.collateralAmountUsd)"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.sumBy((x) => x.fees.pending)"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="rows.sumBy((x) => x.fees.collected)"
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
