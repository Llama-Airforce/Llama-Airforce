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
import { $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { AsyncValue, KPI } from "@/Framework";
import { useConvexStore } from "@/Pages/Convex/Store";

const { t } = useI18n();

// Refs
const store = useConvexStore();

const totalRevenue = $computed((): number => {
  const rev = store.revenue
    ? store.revenue.totalBribeRevenue +
      store.revenue.totalThreeCrvRevenueToCvxCrvStakers +
      store.revenue.totalCrvRevenue +
      store.revenue.totalFxsRevenue
    : 0;
  return rev;
});

const lpRevenue = $computed((): number => {
  const rev = store.revenue
    ? store.revenue.totalCrvRevenueToLpProviders +
      store.revenue.totalFxsRevenueToLpProviders +
      store.revenue.totalCvxRevenueToLpProviders
    : 0;
  return rev;
});

const treasuryRevenue = $computed((): number => {
  const rev = store.revenue
    ? store.revenue.totalCrvRevenueToPlatform +
      store.revenue.totalFxsRevenueToPlatform +
      store.revenue.totalFxsRevenueToCallers
    : 0;
  return rev;
});

const tokenRevenue = $computed((): number => {
  const rev = store.revenue
    ? store.revenue.totalBribeRevenue +
      store.revenue.totalCrvRevenueToCvxStakers +
      store.revenue.totalFxsRevenueToCvxStakers
    : 0;
  return rev;
});

const liquidRevenue = $computed((): number => {
  const rev = store.revenue
    ? store.revenue.totalCrvRevenueToCvxCrvStakers +
      store.revenue.totalCvxRevenueToCvxCrvStakers +
      store.revenue.totalFxsRevenueToCvxFxsStakers +
      store.revenue.totalThreeCrvRevenueToCvxCrvStakers
    : 0;
  return rev;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.summary {
  display: flex;
  flex-grow: 1;

  @media only screen and (max-width: 1280px) {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr;

    > .all-time-revenue {
      grid-row: 1;
      grid-column: 1;
    }

    > .lp-revenue {
      grid-row: 2;
      grid-column: 1;
    }

    > .holder-revenue {
      grid-row: 3;
      grid-column: 1;
    }

    > .liquid-revenue {
      grid-row: 4;
      grid-column: 1;
    }

    > .protocol-revenue {
      grid-row: 5;
      grid-column: 1;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
all-time-revenue: All time total revenue
lp-revenue: Revenue for LPs (incl. CVX emissions)
protocol-revenue: Revenue directed to Convex treasury
holder-revenue: Revenue for CVX lockers
liquid-revenue: Revenue for liquid lockers (cvxCRV, cvxFXS)
</i18n>
