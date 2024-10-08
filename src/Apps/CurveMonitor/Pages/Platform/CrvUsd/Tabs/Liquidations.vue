<script setup lang="ts">
import type { Chain } from "@CM/Models";
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
  ChartLiquidatorRevenue,
  TableTopLiquidators,
  TableLiqOverview,
} from "@CM/Components/Liquidations";
import { ChartCollateralRatio } from "@CM/Components/Lending";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

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
const discounts = computed(() =>
  snapshots.value.map(({ timestamp, discountLiquidation }) => ({
    timestamp,
    discount: discountLiquidation,
  }))
);

const collateralRatios = computed(() =>
  snapshots.value.map(({ timestamp, totalCollateralUsd, totalDebt }) => ({
    timestamp,
    ratio: totalCollateralUsd / totalDebt,
  }))
);

const { isFetching: loadingSoftLiqs, data: softLiqRatios } =
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

<template>
  <div class="dashboard-grid">
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

    <ChartCollateralRatio
      :ratios="collateralRatios"
      :loading="loadingSnapshots"
    ></ChartCollateralRatio>

    <ChartLiqs
      :liqs="liqsAggregate"
      :loading="loadingLiqsAggregate"
    ></ChartLiqs>

    <TableTopLiquidators
      :liqs="liqsDetailed"
      :loading="loadingLiqsDetailed"
    ></TableTopLiquidators>

    <ChartLiquidatorRevenue
      :discounts
      :liqs="liqsDetailed"
      :loading="loadingSnapshots || loadingLiqsDetailed"
    ></ChartLiquidatorRevenue>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
