<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";
import { useQuerySnapshots } from "@CM/queries/crvusd";
import {
  useQueryLiqOverview,
  useQueryLiqsAggregate,
  useQueryLiqsDetailed,
  useQueryLiqHealthDeciles,
  useQueryLiqLosses,
  useQuerySoftLiqRatios,
} from "@CM/queries/liquidations";
import {
  ChartLiqs,
  ChartLiqsSoftLiqRatio,
  ChartLiqsMedianLoss,
  ChartLiqsHealthDeciles,
  ChartLiqsLosersProportion,
  ChartLiquidatorRevenue,
  TableTopLiquidators,
  TableLiqOverview,
} from "@CM/components/liquidations";
import { ChartCollateralRatio } from "@CM/components/lending";

const { market, chain } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
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
    />

    <ChartLiqsSoftLiqRatio
      :ratios="softLiqRatios"
      :prices-oracle
      :loading="loadingSoftLiqs || loadingSnapshots"
    />

    <ChartLiqsMedianLoss
      :losses
      :loading="loadingLosses"
    />

    <ChartLiqsLosersProportion
      :losses
      :loading="loadingLosses"
    />

    <ChartLiqsHealthDeciles
      :deciles
      :loading="loadingDeciles"
    />

    <ChartCollateralRatio
      :ratios="collateralRatios"
      :loading="loadingSnapshots"
    />

    <ChartLiqs
      :liqs="liqsAggregate"
      :loading="loadingLiqsAggregate"
    />

    <TableTopLiquidators
      :liqs="liqsDetailed"
      :loading="loadingLiqsDetailed"
    />

    <ChartLiquidatorRevenue
      :discounts
      :liqs="liqsDetailed"
      :loading="loadingSnapshots || loadingLiqsDetailed"
    />
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
