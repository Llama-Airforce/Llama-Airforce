<script setup lang="ts">
import { useQueryPairs } from "@HA/queries/protocols";

const { protocolName } = defineProps<{
  protocolName?: string;
}>();

const { isFetching: loading, data: pairs } = useQueryPairs(
  toRef(() => ({
    chain: "ethereum",
    protocol_name: protocolName || "",
  })),
  computed(() => !!protocolName)
);

const columns = [
  "",
  { id: "name", label: "Name", sort: true } as const,
  { id: "tvl", label: "TVL", sort: true, align: "end" } as const,
  { id: "rate", label: "Interest Rate", sort: true, align: "end" } as const,
  { id: "util", label: "Util", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("tvl");

const pairsProcessed = computed(() =>
  (pairs.value ?? []).orderBy((pair) => {
    switch (sorting.value.column) {
      case "name":
        return pair.name;
      case "tvl":
        return pair.totalCollateral;
      case "rate":
        return pair.interestRate;
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

        <div>{{ pair.name }}</div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="pair.totalCollateral / 10 ** 21"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="pair.interestRate / 10 ** 8"
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
  --col-width: 11ch;
  --columns-data: 1rem minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.5fr);
}
</style>
