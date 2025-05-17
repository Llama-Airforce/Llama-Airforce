<script setup lang="ts">
import type { FeesCollected } from "@curvefi/prices-api/revenue";

const { fees } = defineProps<{
  fees: FeesCollected[];
}>();

// Data
const columns = [
  { id: "token", label: "", sort: false } as const,
  { id: "symbol", label: "Token", sort: true } as const,
  { id: "amount", label: "Amount", align: "end", sort: true } as const,
  { id: "amountUsd", label: "Amount ($)", align: "end", sort: true } as const,
];

const { sorting, onSort } = useSort<typeof columns>("amountUsd");

const rows = computed(() =>
  fees.orderBy((fee) => {
    switch (sorting.value.column) {
      case "symbol":
        return fee.coin.symbol;
      case "amount":
        return fee.amount;
      case "amountUsd":
      default:
        return fee.amountUsd;
    }
  }, sorting.value.order)
);
</script>

<template>
  <Card title="Fees Collected">
    <Table
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <TokenIcon :address="item.coin.address" />

        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${item.coin.address}`"
          >
            {{ item.coin.symbol }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.amount"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.amountUsd"
            :precision="2"
          />
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.sumBy((x) => x.amountUsd)"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 26px minmax(5rem, 1fr) minmax(5rem, 1fr) minmax(5rem, 1fr);
}
</style>
