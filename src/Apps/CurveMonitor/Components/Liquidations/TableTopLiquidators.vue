<template>
  <Card :title="t('title')">
    <DataTable
      class="datatable-liquidators"
      :rows
      :columns="[
        'Address',
        { label: 'Count', align: 'end' },
        { label: 'Value', align: 'end' },
      ]"
    >
      <template #row="props: { item: Liquidator }">
        <div class="address">
          <a
            :href="`https://etherscan.io/address/${props.item.liquidator}`"
            target="_blank"
          >
            {{ addressShort(props.item.liquidator, 8) }}
          </a>
        </div>
        <div class="end">
          <AsyncValue
            :value="props.item.count"
            :precision="0"
            :show-zero="true"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="props.item.value"
            :precision="1"
            type="dollar"
          />
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { addressShort } from "@/Wallet";
import { type LiquidationDetails } from "@CM/Services/Liquidations";

const { t } = useI18n();

// Props
interface Props {
  liqs: LiquidationDetails[];
}

const { liqs } = defineProps<Props>();

type Liquidator = {
  liquidator: string;
  count: number;
  value: number;
};

const rows = computed((): Liquidator[] =>
  chain_(liqs)
    .groupBy((x) => x.liquidator)
    .map((xs, liquidator) => ({
      liquidator,
      count: xs.length,
      value: xs.reduce((acc, x) => acc + x.collateralReceivedUsd, 0),
    }))
    .orderBy((x) => x.value, "desc")
    .take(5)
    .value()
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-liquidators {
  --columns-header: minmax(7rem, 1fr) minmax(auto, 25rem);

  --col-width: 12ch;
  --columns-data: 1fr repeat(2, var(--col-width));
}
</style>

<i18n lang="yaml" locale="en">
title: Top Liquidators
</i18n>
