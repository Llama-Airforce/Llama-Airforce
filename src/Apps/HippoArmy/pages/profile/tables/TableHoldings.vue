<script setup lang="ts">
import type { Snapshot } from "@HA/services/user/schema";

const { snapshots, user, loading } = defineProps<{
  snapshots: Snapshot[];
  user?: string;
  loading: boolean;
}>();

const columns = [
  { id: "time", label: "Time", sort: true } as const,
  { id: "collateral", label: "Collateral", sort: true, align: "end" } as const,
  {
    id: "underlying",
    label: "Underlying Value",
    sort: true,
    align: "end",
  } as const,
  { id: "debt", label: "Debt", sort: true, align: "end" } as const,
  {
    id: "collateralRatio",
    label: "Collateral Ratio",
    sort: true,
    align: "end",
  } as const,
  {
    id: "maxBorrowable",
    label: "Max Borrowable",
    sort: true,
    align: "end",
  } as const,
];

const { sorting, onSort } = useSort<typeof columns>("time", "desc");

const holdings = computed(() =>
  snapshots.orderBy((x) => {
    switch (sorting.value.column) {
      case "time":
        return x.time.getTime();
      case "collateral":
        return x.collateral;
      case "underlying":
        return x.underlying;
      case "debt":
        return x.debt;
      case "collateralRatio":
        return x.collateralRatio;
      case "maxBorrowable":
        return x.maxBorrowable;
    }
  }, sorting.value.order)
);

const hasData = computed(() => snapshots.length > 0);
</script>

<template>
  <Card
    title="Current Holdings"
    :loading
  >
    <Table
      v-if="hasData"
      :rows="holdings"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>{{ item.time.toLocaleString() }}</div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.collateral"
            :precision="4"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.underlying"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.debt"
            :precision="4"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="percentage"
            :value="item.collateralRatio"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.maxBorrowable"
            :precision="4"
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
  --columns-data: 10rem minmax(8rem, 1fr) minmax(8rem, 1fr) minmax(6rem, 1fr)
    minmax(8rem, 1fr) minmax(8rem, 1fr);
}
</style>
