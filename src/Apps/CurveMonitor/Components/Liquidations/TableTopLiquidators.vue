<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type LiquidationDetails } from "@CM/Services/Liquidations";

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
            :href="`https://etherscan.io/address/${item.liquidator}`"
            target="_blank"
          >
            {{ addressShort(item.liquidator, 8) }}
          </a>
        </div>
        <div class="end">
          <AsyncValue
            :value="item.count"
            :precision="0"
            :show-zero="true"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="item.value"
            :precision="1"
            type="dollar"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style lang="scss" scoped>
.liquidators-table {
  --col-width: 12ch;
  --columns-data: 1fr repeat(2, var(--col-width));
}
</style>
