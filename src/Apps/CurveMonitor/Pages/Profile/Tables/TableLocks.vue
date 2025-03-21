<script setup lang="ts">
import { useQueryUserLocks } from "@CM/queries/dao";

const { user } = defineProps<{ user: string | undefined }>();

const { isFetching: loading, data } = useQueryUserLocks(toRef(() => user));

const columns = [
  { id: "timestamp", label: "Time", sort: true } as const,
  { id: "amount", label: "Amount", sort: true, align: "end" } as const,
  { id: "unlock", label: "Unlock Date", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  data.value
    .orderBy((x) => {
      switch (sorting.value.column) {
        case "timestamp":
          return x.timestamp.getTime();
        case "amount":
          return Number(x.amount);
        case "unlock":
          return x.unlockTime.getTime();
      }
    }, sorting.value.order)
    .take(100)
);
</script>

<template>
  <Card
    title="Locks"
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
            {{ item.timestamp.toLocaleDateString() }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            v-if="item.lockType !== 'INCREASE_UNLOCK_TIME'"
            :value="Number(item.amount) / 10 ** 18"
          />
          <span
            v-else
            style="color: var(--c-lvl5)"
          >
            Extension
          </span>
        </div>

        <div class="end">
          {{ item.unlockTime.toLocaleDateString() }}
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(user)} has no veCRV locks`"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 1fr minmax(7rem, 1fr) 1fr;
}
</style>
