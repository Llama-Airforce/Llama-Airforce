<script setup lang="ts">
import type { CollateralEvent } from "@HA/services/pairs/schema";
import type { Pair } from "@HA/services/protocols/schema";

const {
  events: rows,
  count,
  pair,
  loading,
} = defineProps<{
  events: CollateralEvent[];
  count: number;
  pair: Pair;
  loading: boolean;
}>();

const emit = defineEmits<{
  page: [page: number];
}>();

const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (page) => {
  emit("page", page);
});

const { relativeTime } = useRelativeTime();

const type = (x: CollateralEvent) => {
  switch (x.eventType) {
    case "add_collateral":
      return "Add collateral";
    case "borrow":
      return "Borrow";
    case "remove_collateral":
      return "Remove collateral";
    case "repay":
      return "Repay";
    case "redeem":
      return "Redeem";
    case "liquidate":
      return "Liquidate";
    case "leveraged_position":
      return "Lev. position";
    case "repay_with_collateral":
      return "Repay with col";
  }
};
</script>

<template>
  <Card title="Events">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </template>

    <Table
      v-if="rows.length > 0"
      :rows
      :columns="[
        'Type',
        { label: 'Δ Debt', align: 'end' },
        { label: 'Δ Collateral', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div>{{ type(event) }}</div>

        <div class="end">
          <div
            v-if="event.debtChange !== 0"
            style="display: flex; gap: 1ch"
          >
            <AsyncValue
              type="dollar"
              :value="event.debtChange / 10 ** 18"
              :precision="2"
              :show-symbol="false"
            />
            {{ pair.tokenDebt.symbol }}
          </div>
        </div>

        <div class="end">
          <div
            v-if="event.collateralChange !== 0"
            style="display: flex; gap: 1ch"
          >
            <AsyncValue
              type="dollar"
              :value="event.collateralChange / 10 ** 18"
              :precision="2"
              :show-symbol="false"
            />
            {{ pair.tokenCollateral.symbol }}
          </div>
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${event.txHash}`"
            @click.stop
          >
            {{ relativeTime(event.blockTime.getUTCTimestamp()) }}
          </a>
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      message="There are no events"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 8rem 1fr 1fr 6rem;
}
</style>
