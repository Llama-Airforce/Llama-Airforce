<script setup lang="ts">
import type { Pair } from "@HA/services/protocols/schema";
import type { Snapshot } from "@HA/services/user/schema";

const { snapshots, user, loading } = defineProps<{
  snapshots: Snapshot[];
  pair: Pair;
  user?: string;
  loading: boolean;
}>();

const columns = [
  { id: "time", label: "Time", sort: true } as const,
  { id: "underlying", label: "Underlying", sort: true, align: "end" } as const,
  { id: "debt", label: "Debt", sort: true, align: "end" } as const,
  {
    id: "collateralRatio",
    label: "Collateral Ratio",
    sort: true,
    align: "end",
  } as const,
];

const { sorting, onSort } = useSort<typeof columns>("time", "desc");

const rows = computed(() =>
  snapshots.orderBy((x) => {
    switch (sorting.value.column) {
      case "time":
        return x.time.getTime();
      case "underlying":
        return x.underlying;
      case "debt":
        return x.debt;
      case "collateralRatio":
        return x.collateralRatio;
    }
  }, sorting.value.order)
);

const hasData = computed(() => snapshots.length > 0);
</script>

<template>
  <Card
    title=" Snapshots"
    :loading
  >
    <Table
      v-if="hasData"
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>{{ item.time.toLocaleString() }}</div>

        <div
          class="end"
          style="display: flex; gap: 1ch"
        >
          <AsyncValue
            type="dollar"
            :value="item.underlying"
            :precision="2"
            :show-symbol="false"
          />
          {{ pair.tokenPairUnderyling.symbol }}
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.debt"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="percentage"
            :value="item.collateralRatio * 100"
            :precision="2"
          />
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(user)} has no snapshots`"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 10rem minmax(6rem, 1fr) minmax(6rem, 1fr) minmax(8rem, 1fr);
}
</style>
