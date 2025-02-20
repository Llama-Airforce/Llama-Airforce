<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";
import type { Market } from "@curvefi/prices-api/llamalend";
import { useQuerySnapshots } from "@CM/queries/llamalend";
import {
  useQuerySoftLiqRatios,
  useQueryLiqsAggregate,
  useQueryLiqsDetailed,
  useQueryLiqOverview,
  useQueryLiqLosses,
  useQueryLiqHealthDeciles,
} from "@CM/queries/liquidations";
import {
  ChartLiqs,
  ChartLiqsSoftLiqRatio,
  ChartLiqsMedianLoss,
  ChartLiqsLosersProportion,
  ChartLiqsHealthDeciles,
  ChartLiquidatorRevenue,
  TableTopLiquidators,
  TableLiqOverview,
} from "@CM/components/liquidations";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

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

const discounts = computed(() =>
  snapshots.value.map(({ timestamp, discountLiquidation }) => ({
    timestamp,
    discount: discountLiquidation,
  }))
);

const { isFetching: loadingLiqsAggregate, data: liqsAggregate } =
  useQueryLiqsAggregate(
    ref("lending"),
    toRef(() => chain),
    controller
  );

const { isFetching: loadingLiqsDetailed, data: liqsDetailed } =
  useQueryLiqsDetailed(
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

const { isFetching: loadingOverview, data: overview } = useQueryLiqOverview(
  ref("lending"),
  toRef(() => chain),
  controller
);

const { isFetching: loadingLosses, data: losses } = useQueryLiqLosses(
  ref("lending"),
  toRef(() => chain),
  controller
);

const { isFetching: loadingDeciles, data: deciles } = useQueryLiqHealthDeciles(
  ref("lending"),
  toRef(() => chain),
  controller
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
