<script setup lang="ts">
import { useQueryLockers } from "@CM/queries/dao";

// Data
const { isFetching: loading, data } = useQueryLockers();

const columns = [
  { id: "locker", label: "Locker", sort: false } as const,
  { id: "weight", label: "Weight", sort: true, align: "end" } as const,
  { id: "ratio", label: "Ratio", sort: true, align: "end" } as const,
  { id: "unlock", label: "Unlock Date", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("weight");

const rows = computed(() =>
  data.value.orderBy((x) => {
    switch (sorting.value.column) {
      case "weight":
        return Number(x.weight) / 10 ** 18;
      case "ratio":
        return x.weightRatio;
      case "unlock":
        return x.unlockTime;
    }
  }, sorting.value.order)
);

const router = useRouter();

async function onSelect(row: (typeof data.value)[number]) {
  await router.push({
    name: "profile",
    params: {
      tab: "governance",
    },
    query: {
      user: row.user,
    },
  });
}
</script>

<template>
  <Card
    title="Top Lockers"
    :loading
  >
    <Table
      :rows
      :columns
      :sorting
      @sort-column="onSort"
      @select="onSelect"
    >
      <template #row="{ item }">
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${item.user}`"
            @click.stop
          >
            {{ item.user }}
          </a>
        </div>

        <div class="end">
          <AsyncValue :value="Number(item.weight) / 10 ** 18" />
        </div>

        <div class="end">
          <AsyncValue
            type="percentage"
            :value="item.weightRatio"
            :precision="2"
          />
        </div>

        <div class="end">
          {{ new Date(item.unlockTime * 1000).toLocaleDateString() }}
        </div>

        <IconExpander />
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 1fr minmax(7rem, 0.5fr) minmax(7rem, 0.5fr)
    minmax(7rem, 0.5fr) 1rem;
}
</style>
