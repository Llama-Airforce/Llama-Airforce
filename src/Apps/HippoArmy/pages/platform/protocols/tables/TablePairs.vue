<script setup lang="ts">
import { usePairs } from "@HA/queries/protocols";
import { pairName } from "@HA/util";

const { protocolName } = defineProps<{
  protocolName?: string;
}>();

const { isFetching: loading, data } = usePairs(
  toRef(() => ({
    chain: "ethereum",
    protocol_name: protocolName || "",
  })),
  computed(() => !!protocolName)
);

const pairs = computed(() =>
  data.value?.filter((pair) => pair.borrowLimit > 0)
);

const columns = [
  "",
  "",
  { id: "name", label: "Name", sort: true } as const,
  { id: "tvl", label: "TVL", sort: true, align: "end" } as const,
  {
    id: "baseReward",
    label: "Base Reward Rate",
    sort: true,
    align: "end",
  } as const,
  { id: "borrowRate", label: "Borrow Rate", sort: true, align: "end" } as const,
  { id: "util", label: "Util", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("tvl");

const pairsProcessed = computed(() =>
  (pairs.value ?? []).orderBy((pair) => {
    switch (sorting.value.column) {
      case "name":
        return pairName(pair.name);
      case "tvl":
        return pair.totalUnderlying;
      case "baseReward":
        return pair.aprBase;
      case "borrowRate":
        return pair.aprBorrowCost;
      case "util":
        return pair.utilizationRate;
    }
  }, sorting.value.order)
);

const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(pairsProcessed, rowsPerPage);

// Pair selection
const router = useRouter();

const onPairSelect = async (newPair: (typeof pairsProcessed.value)[number]) => {
  await router.push({
    name: "pair",
    params: {
      protocolName: protocolName?.toLocaleLowerCase(),
      pairId: newPair.pairId.toString(),
    },
  });
};
</script>

<template>
  <Card
    title="Pairs"
    :loading
  >
    <template #actions>
      <Pagination
        :items-count="pairsProcessed.length"
        :items-per-page="rowsPerPage"
        :page
        @page="onPage"
      />
    </template>

    <Table
      class="pairs-table"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
      @select="onPairSelect"
    >
      <template #row="{ item: pair }">
        <IconExpander />

        <div class="token">
          <TokenIcon
            :key="pair.tokenPairCollateral.symbol"
            chain="ethereum"
            :address="pair.tokenPairCollateral.address"
          />
        </div>

        <div>{{ pairName(pair.name) }}</div>

        <div
          class="end"
          style="display: flex; gap: 1ch"
        >
          <AsyncValue
            show-zero
            type="dollar"
            :value="pair.totalUnderlying"
            :precision="2"
            :show-symbol="false"
          />

          {{ pair.tokenPairUnderyling.symbol }}
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="pair.aprBase"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="pair.aprBorrowCost"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="pair.utilizationRate"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.pairs-table {
  --col-width: 13ch;
  --columns-data: 1rem calc(1 * (26px + 1ch)) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.5fr);
}

.token {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
