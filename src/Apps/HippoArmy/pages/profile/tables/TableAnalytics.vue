<script setup lang="ts">
import type { Snapshot } from "@HA/services/user/schema";

const { snapshots, user, loading } = defineProps<{
  snapshots: Snapshot[];
  user?: string;
  loading: boolean;
}>();

const columns = [
  { id: "time", label: "Time", sort: true } as const,
  {
    id: "interestAccrued",
    label: "Interest Accrued",
    sort: true,
    align: "end",
  } as const,
  {
    id: "redemptionLost",
    label: "Redemption Lost",
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
      case "interestAccrued":
        return x.interestAccrued;
      case "redemptionLost":
        return x.redemptionLost;
    }
  }, sorting.value.order)
);

const hasData = computed(() => snapshots.length > 0);
</script>

<template>
  <Card
    title="Analytics Summary"
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

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.interestAccrued"
            :precision="4"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.redemptionLost"
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
  --columns-data: 10rem minmax(8rem, 1fr) minmax(8rem, 1fr);
}
</style>
