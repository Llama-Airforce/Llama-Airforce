<script setup lang="ts">
import type { Snapshot } from "@HA/services/user/schema";

const { snapshots } = defineProps<{
  snapshots: Snapshot[];
}>();

const columns = [
  { id: "time", label: "Time", sort: true } as const,
  { id: "collateral", label: "Collateral", sort: true, align: "end" } as const,
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
  {
    id: "interestAccrued",
    label: "Interest Accrued",
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
      case "collateral":
        return x.collateral;
      case "debt":
        return x.debt;
      case "collateralRatio":
        return x.collateralRatio;
      case "maxBorrowable":
        return x.maxBorrowable;
      case "interestAccrued":
        return x.interestAccrued;
    }
  }, sorting.value.order)
);
</script>

<template>
  <Card title="User Snapshots">
    <Table
      :rows
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
            :precision="2"
          />
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
            :value="item.collateralRatio"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.maxBorrowable"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.interestAccrued"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 10rem 1fr 1fr 1fr 1fr 1fr;
}
</style>
