<script setup lang="ts">
import { type FeesStaged } from "@CM/Services/Revenue";

const { fees } = defineProps<{
  fees: FeesStaged[];
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
      default:
        return fee.amountUsd;
    }
  }, sorting.value.order)
);
</script>

<template>
  <Card title="Fees Staged">
    <Table
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <TokenIcon :address="item.coin.address"></TokenIcon>

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
            :value="item.amount"
            :precision="2"
            :show-symbol="false"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="item.amountUsd"
            :precision="2"
            :show-zero="true"
            type="dollar"
          />
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            :value="rows.reduce((acc, x) => acc + x.amountUsd, 0)"
            :precision="2"
            type="dollar"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.table {
  --columns-data: 26px minmax(5rem, 1fr) minmax(5rem, 1fr) minmax(5rem, 1fr);

  img {
    width: 26px;
  }
}
</style>
