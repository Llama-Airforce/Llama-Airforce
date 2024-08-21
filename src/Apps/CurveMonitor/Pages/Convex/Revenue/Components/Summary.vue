<script setup lang="ts">
import { useConvexStore } from "@CM/Pages/Convex/Store";

// Refs
const store = useConvexStore();

const totalRevenue = computed(
  (): number =>
    store.revenue.totalBribeRevenue +
    store.revenue.totalThreeCrvRevenueToCvxCrvStakers +
    store.revenue.totalCrvRevenue +
    store.revenue.totalFxsRevenue +
    store.revenue.totalOtherRevenue
);

const lpRevenue = computed(
  (): number =>
    store.revenue.totalCrvRevenueToLpProviders +
    store.revenue.totalFxsRevenueToLpProviders +
    store.revenue.totalCvxRevenueToLpProviders
);

const treasuryRevenue = computed(
  (): number =>
    store.revenue.totalCrvRevenueToPlatform +
    store.revenue.totalFxsRevenueToPlatform +
    store.revenue.totalFxsRevenueToCallers +
    store.revenue.totalOtherRevenue
);

const tokenRevenue = computed(
  (): number =>
    store.revenue.totalBribeRevenue +
    store.revenue.totalCrvRevenueToCvxStakers +
    store.revenue.totalFxsRevenueToCvxStakers
);

const liquidRevenue = computed(
  (): number =>
    store.revenue.totalCrvRevenueToCvxCrvStakers +
    store.revenue.totalCvxRevenueToCvxCrvStakers +
    store.revenue.totalFxsRevenueToCvxFxsStakers +
    store.revenue.totalThreeCrvRevenueToCvxCrvStakers
);
</script>

<template>
  <div class="summary">
    <KPI
      class="all-time-revenue"
      label="All time total revenue"
      :has-value="!!totalRevenue"
    >
      <AsyncValue
        :value="totalRevenue"
        :precision="2"
        type="dollar"
      />
    </KPI>

    <KPI
      class="lp-revenue"
      label="Revenue for LPs (incl. CVX emissions)"
      :has-value="!!lpRevenue"
    >
      <AsyncValue
        :value="lpRevenue"
        :precision="2"
        type="dollar"
      />
    </KPI>

    <KPI
      class="holder"
      label="Revenue for CVX lockers"
      :has-value="!!tokenRevenue"
    >
      <AsyncValue
        :value="tokenRevenue"
        :precision="2"
        type="dollar"
      />
    </KPI>

    <KPI
      class="liquid-revenue"
      label="Revenue for liquid lockers (cvxCRV, cvxFXS)"
      :has-value="!!liquidRevenue"
    >
      <AsyncValue
        :value="liquidRevenue"
        :precision="2"
        type="dollar"
      />
    </KPI>

    <KPI
      class="protocol-revenue"
      label="Revenue directed to Convex treasury"
      :has-value="!!treasuryRevenue"
    >
      <AsyncValue
        :value="treasuryRevenue"
        :precision="2"
        type="dollar"
      />
    </KPI>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
