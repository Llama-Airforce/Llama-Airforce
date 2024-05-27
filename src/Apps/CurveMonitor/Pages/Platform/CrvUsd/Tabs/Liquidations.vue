<template>
  <div class="liquidations">
    <TableLiqOverview
      :overview
      :loading="loadingOverview"
    ></TableLiqOverview>

    <ChartLiqsSoftLiqRatio
      :ratios="softLiqRatios"
      :prices-oracle="pricesOracle"
      :loading="loadingSoftLiqs || loadingSnapshots"
    ></ChartLiqsSoftLiqRatio>

    <ChartLiqsMedianLoss
      :losses
      :loading="loadingLosses"
    ></ChartLiqsMedianLoss>

    <ChartLiqsLosersProportion
      :losses
      :loading="loadingLosses"
    ></ChartLiqsLosersProportion>

    <ChartLiqsHealthDeciles
      :deciles
      :loading="loadingDeciles"
    ></ChartLiqsHealthDeciles>

    <ChartLiquidationCollateralRatio :market></ChartLiquidationCollateralRatio>

    <ChartLiqs
      :liqs="liqsAggregate"
      :loading="loadingLiqsAggregate"
    ></ChartLiqs>

    <TableTopLiquidators
      :liqs="liqsDetailed"
      :loading="loadingLiqsDetailed"
    ></TableTopLiquidators>

    <ChartLiquidationLiquidatorRevenue
      :market
    ></ChartLiquidationLiquidatorRevenue>
  </div>
</template>

<script setup lang="ts">
import type { Chain } from "@CM/Models/Chain";
import type { Market } from "@CM/Services/CrvUsd";
import { useQuerySnapshots } from "@CM/Services/CrvUsd/Queries";
import {
  useQueryLiqOverview,
  useQueryLiqsAggregate,
  useQueryLiqsDetailed,
  useQueryLiqHealthDeciles,
  useQueryLiqLosses,
  useQuerySoftLiqRatios,
} from "@CM/Services/Liquidations/Queries";
import {
  ChartLiqs,
  ChartLiqsSoftLiqRatio,
  ChartLiqsMedianLoss,
  ChartLiqsHealthDeciles,
  ChartLiqsLosersProportion,
  TableTopLiquidators,
  TableLiqOverview,
} from "@CM/Components/Liquidations";
import {
  ChartLiquidationLiquidatorRevenue,
  ChartLiquidationCollateralRatio,
} from "@CM/Pages/Platform/CrvUsd/Charts";

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

const marketAddr = computed(() => market?.address);

// Data
const { isFetching: loadingOverview, data: overview } = useQueryLiqOverview(
  ref("crvusd"),
  toRef(() => chain),
  marketAddr
);

const { isFetching: loadingSnapshots, data: snapshots } = useQuerySnapshots(
  toRef(() => market)
);
const pricesOracle = computed(() =>
  snapshots.value.map(({ timestamp, priceOracle }) => ({
    timestamp,
    priceOracle,
  }))
);

const softLiqRatios = computed(() =>
  softLiqRatiosRaw.value.map(({ timestamp, proportion }) => ({
    timestamp,
    proportion: proportion * 100,
  }))
);
const { isFetching: loadingSoftLiqs, data: softLiqRatiosRaw } =
  useQuerySoftLiqRatios(
    ref("crvusd"),
    toRef(() => chain),
    marketAddr
  );

const { isFetching: loadingLiqsAggregate, data: liqsAggregate } =
  useQueryLiqsAggregate(
    ref("crvusd"),
    toRef(() => chain),
    marketAddr
  );

const { isFetching: loadingLiqsDetailed, data: liqsDetailed } =
  useQueryLiqsDetailed(
    ref("crvusd"),
    toRef(() => chain),
    marketAddr
  );

const { isFetching: loadingDeciles, data: deciles } = useQueryLiqHealthDeciles(
  ref("crvusd"),
  toRef(() => chain),
  marketAddr
);

const { isFetching: loadingLosses, data: losses } = useQueryLiqLosses(
  ref("crvusd"),
  toRef(() => chain),
  marketAddr
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
