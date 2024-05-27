<template>
  <div class="liquidations">
    <ChartLiqsSoftLiqRatio
      :ratios="softLiqRatios"
      :prices-oracle="pricesOracle"
      :loading="loadingSoftLiqs || loadingSnapshots"
    ></ChartLiqsSoftLiqRatio>

    <ChartLiqs
      :liqs="liqsAggregate"
      :loading="loadingLiqsAggregate"
    ></ChartLiqs>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/LlamaLend";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import {
  useQuerySoftLiqRatios,
  useQueryLiqsAggregate,
} from "@CM/Services/Liquidations/Queries";
import { ChartLiqs, ChartLiqsSoftLiqRatio } from "@CM/Components/Liquidations";

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

const controller = computed(() => market?.controller);

// Data
const { isFetching: loadingSnapshots, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);
const pricesOracle = computed(() =>
  snapshots.value.map(({ timestamp, priceOracle }) => ({
    timestamp,
    priceOracle,
  }))
);

const { isFetching: loadingLiqsAggregate, data: liqsAggregate } =
  useQueryLiqsAggregate(
    ref("lending"),
    toRef(() => chain),
    controller
  );

const { isFetching: loadingSoftLiqs, data: softLiqRatiosRaw } =
  useQuerySoftLiqRatios(
    ref("lending"),
    toRef(() => chain),
    controller
  );
const softLiqRatios = computed(() =>
  softLiqRatiosRaw.value.map(({ timestamp, proportion }) => ({
    timestamp,
    proportion: proportion * 100,
  }))
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
}
</style>
