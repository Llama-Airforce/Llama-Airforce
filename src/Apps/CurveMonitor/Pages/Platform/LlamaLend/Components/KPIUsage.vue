<script setup lang="ts">
import { type Market } from "@CM/Services/LlamaLend";

const { market } = defineProps<{
  market: Market | undefined;
}>();

const totalCollateralUsd = computed(
  () =>
    (market?.collateral_balance_usd ?? 0) + (market?.borrowed_balance_usd ?? 0)
);

const collateralLabel = computed(() => {
  const collateral = "Collateral";
  const symbolCollateral = market?.collateral_token.symbol ?? "?";
  const symbolBorrowed = market?.borrowed_token.symbol ?? "?";

  return `${collateral} (${symbolCollateral} / ${symbolBorrowed})`;
});

const utilRate = computed(() => {
  if (!market) {
    return 0;
  }

  return market.total_assets_usd === 0
    ? 0
    : market.total_debt_usd / market.total_assets_usd;
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
            :value="market?.collateral_balance"
            :show-symbol="false"
            :show-zero="true"
            type="dollar"
          ></AsyncValue>

          /

          <AsyncValue
            :value="market?.borrowed_balance"
            :show-symbol="false"
            :show-zero="true"
            type="dollar"
          ></AsyncValue>
        </div>

        <AsyncValue
          :value="totalCollateralUsd"
          :show-zero="true"
          :inline="false"
          type="dollar"
        ></AsyncValue>
      </div>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      :label="'Borrowed' + ` (${market?.borrowed_token.symbol ?? '?'})`"
      :has-value="!!market"
    >
      <div class="two-sides">
        <AsyncValue
          :value="market?.total_debt"
          :show-symbol="false"
          :show-zero="true"
          :inline="false"
          type="dollar"
        ></AsyncValue>

        <AsyncValue
          :value="market?.total_debt_usd"
          :show-zero="true"
          :inline="false"
          type="dollar"
        ></AsyncValue>
      </div>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      :label="'Supplied' + ` (${market?.borrowed_token.symbol ?? '?'})`"
      :has-value="!!market"
    >
      <div class="two-sides">
        <AsyncValue
          :value="market?.total_assets"
          :show-symbol="false"
          :show-zero="true"
          :inline="false"
          type="dollar"
        ></AsyncValue>

        <AsyncValue
          :value="market?.total_assets_usd"
          :show-zero="true"
          :inline="false"
          type="dollar"
        ></AsyncValue>
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
        :value="utilRate * 100"
        :show-zero="true"
        type="percentage"
      ></AsyncValue>
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
    & {
      grid-template-columns: repeat(2, 1fr);
      grid-template-areas:
        "kpi1 kpi2"
        "kpi3 kpi4";
    }
  }

  .two-sides {
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    justify-content: space-between;

    .collateral {
      display: flex;
    }
  }
}
</style>
