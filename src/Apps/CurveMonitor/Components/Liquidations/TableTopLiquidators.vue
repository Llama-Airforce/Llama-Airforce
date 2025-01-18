<script setup lang="ts">
import type { LiquidationDetails } from "@CM/Services/liquidations";

const { liqs } = defineProps<{
  liqs: LiquidationDetails[];
}>();

type Liquidator = {
  liquidator: string;
  count: number;
  value: number;
};

const rows = computed((): Liquidator[] =>
  liqs
    .groupBy((x) => x.liquidator)
    .entries()
    .map(([liquidator, xs]) => ({
      liquidator,
      count: xs.length,
      value: xs.reduce((acc, x) => acc + x.collateralReceivedUsd, 0),
    }))
    .orderBy((x) => x.value, "desc")
    .take(5)
);
</script>

<template>
  <Card title="Top Liquidators">
    <Table
      class="liquidators-table"
      :rows
      :columns="[
        'Address',
        { label: 'Count', align: 'end' },
        { label: 'Value', align: 'end' },
      ]"
    >
      <template #row="{ item }">
        <div class="address">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${item.liquidator}`"
          >
            {{ addressShort(item.liquidator, 8) }}
          </a>
        </div>
        <div class="end">
          <AsyncValue
            show-zero
            :value="item.count"
            :precision="0"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.value"
            :precision="1"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.liquidators-table {
  --columns-data: 1fr repeat(2, 12ch);
}
</style>
