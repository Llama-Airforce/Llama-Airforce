<template>
  <div class="summary">
    <KPI
      class="all-time-revenue"
      :label="t('all-time-revenue')"
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
      :label="t('lp-revenue')"
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
      :label="t('holder-revenue')"
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
      :label="t('liquid-revenue')"
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
      :label="t('protocol-revenue')"
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

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { AsyncValue, KPI } from "@/Framework";
import { useConvexStore } from "@/Pages/Convex/Store";

const { t } = useI18n();

// Refs
const store = useConvexStore();

const totalRevenue = computed(
  (): number =>
    store.revenue.totalBribeRevenue +
    store.revenue.totalThreeCrvRevenueToCvxCrvStakers +
    store.revenue.totalCrvRevenue +
    store.revenue.totalFxsRevenue
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
    store.revenue.totalFxsRevenueToCallers
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.summary {
  display: flex;
  flex-direction: column;
}
</style>

<i18n lang="yaml" locale="en">
all-time-revenue: All time total revenue
lp-revenue: Revenue for LPs (incl. CVX emissions)
protocol-revenue: Revenue directed to Convex treasury
holder-revenue: Revenue for CVX lockers
liquid-revenue: Revenue for liquid lockers (cvxCRV, cvxFXS)
</i18n>
