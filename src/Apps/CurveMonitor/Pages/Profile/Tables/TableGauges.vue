<script setup lang="ts">
import { useQueryUserGaugeVotes } from "@CM/Services/Gauge/Queries";

const { user } = defineProps<{ user: string | undefined }>();

const { isFetching: loading, data } = useQueryUserGaugeVotes(toRef(() => user));

const columns = [
  { id: "timestamp", label: "Time", sort: true } as const,
  { id: "gauge", label: "Gauge", sort: false } as const,
  { id: "weight", label: "Weight", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  data.value
    .orderBy((x) => {
      switch (sorting.value.column) {
        case "timestamp":
          return x.timestamp;
        case "weight":
          return x.weight;
      }
    }, sorting.value.order)
    .take(100)
);
</script>

<template>
  <Card
    title="Gauge Votes"
    :loading
  >
    <Table
      v-if="rows.length > 0"
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/tx/${item.txHash}`"
          >
            {{ new Date(item.timestamp * 1000).toLocaleDateString() }}
          </a>
        </div>

        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${item.gauge}`"
          >
            {{ item.gaugeName?.replace(/^Curve\.fi /, "") }}
          </a>
        </div>

        <div class="end">
          <AsyncValue :value="item.weight" />
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(user)} has not voted for any gauges yet`"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: minmax(7rem, 0.1fr) minmax(7rem, 1fr) minmax(7rem, 0.1fr);
}
</style>
