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

<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { type Market } from "@CM/Services/LlamaLend";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import {
  useQuerySoftLiqRatios,
  useQueryLiqsAggregate,
  useQueryLiqsDetailed,
  useQueryLiqOverview,
  useQueryLiqLosses,
  useQueryLiqHealthDeciles,
} from "@CM/Services/Liquidations/Queries";
import {
  ChartLiqs,
  ChartLiqsSoftLiqRatio,
  ChartLiqsMedianLoss,
  ChartLiqsLosersProportion,
  ChartLiqsHealthDeciles,
  ChartLiquidatorRevenue,
  TableTopLiquidators,
  TableLiqOverview,
} from "@CM/Components/Liquidations";

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
}
</style>
