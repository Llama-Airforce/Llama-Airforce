<script setup lang="ts">
import type { Market } from "@curvefi/prices-api/llamalend";

const { market } = defineProps<{
  market: Market | undefined;
}>();

const totalCollateralUsd = computed(
  () => (market?.collateralBalanceUsd ?? 0) + (market?.borrowedBalanceUsd ?? 0)
);

const collateralLabel = computed(() => {
  const collateral = "Collateral";
  const symbolCollateral = market?.collateralToken.symbol ?? "?";
  const symbolBorrowed = market?.borrowedToken.symbol ?? "?";

  return `${collateral} (${symbolCollateral} / ${symbolBorrowed})`;
});

const utilRate = computed(() => {
  if (!market) {
    return 0;
  }

  return market.totalAssetsUsd === 0
    ? 0
    : market.totalDebtUsd / market.totalAssetsUsd;
});
</script>

<template>
  <div class="usage">
    <KPI
      style="grid-area: kpi1"
      :label="collateralLabel"
      :has-value="!!market"
    >
      <div class="two-sides">
        <div class="collateral">
          <AsyncValue
            show-zero
            type="dollar"
            :value="market?.collateralBalance"
            :show-symbol="false"
          />

          <span style="color: var(--c-lvl5)">/</span>

          <AsyncValue
            show-zero
            type="dollar"
            :value="market?.borrowedBalance"
            :show-symbol="false"
          />
        </div>

        <AsyncValue
          show-zero
          type="dollar"
          :value="totalCollateralUsd"
        />
      </div>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      :label="'Borrowed' + ` (${market?.borrowedToken.symbol ?? '?'})`"
      :has-value="!!market"
    >
      <div class="two-sides">
        <AsyncValue
          show-zero
          type="dollar"
          :value="market?.totalDebt"
          :show-symbol="false"
        />

        <AsyncValue
          show-zero
          type="dollar"
          :value="market?.totalDebtUsd"
        />
      </div>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      :label="'Supplied' + ` (${market?.collateralToken.symbol ?? '?'})`"
      :has-value="!!market"
    >
      <div class="two-sides">
        <AsyncValue
          show-zero
          type="dollar"
          :value="market?.totalAssets"
          :show-symbol="false"
        />

        <AsyncValue
          show-zero
          type="dollar"
          :value="market?.totalAssetsUsd"
        />
      </div>
    </KPI>

    <KPI
      style="grid-area: kpi4"
      tooltip-type="icon"
      label="Utilization Rate"
      tooltip="Utilization rate is total supplied divided by total borrowed"
      :has-value="!!market"
    >
      <AsyncValue
        show-zero
        type="percentage"
        :value="utilRate * 100"
      />
    </KPI>
  </div>
</template>

<style scoped>
.usage {
  display: grid;
  gap: var(--dashboard-gap);
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas: "kpi1 kpi2 kpi3 kpi4";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "kpi1 kpi2"
      "kpi3 kpi4";
  }

  .two-sides {
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    justify-content: space-between;

    .collateral {
      display: flex;
      gap: 0.5ch;
    }
  }
}
</style>
