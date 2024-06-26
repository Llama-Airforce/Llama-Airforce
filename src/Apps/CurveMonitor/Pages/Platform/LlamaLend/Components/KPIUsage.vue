<template>
  <div class="usage">
    <KPI
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
      :label="t('borrowed') + ` (${market?.borrowed_token.symbol ?? '?'})`"
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
      :label="t('supplied') + ` (${market?.borrowed_token.symbol ?? '?'})`"
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
      tooltip-type="icon"
      :label="t('util-rate')"
      :has-value="!!market"
      :tooltip="t('util-rate-tooltip')"
    >
      <AsyncValue
        :value="utilRate * 100"
        :show-zero="true"
        type="percentage"
      ></AsyncValue>
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { type Market } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();

const totalCollateralUsd = computed(
  () =>
    (market?.collateral_balance_usd ?? 0) + (market?.borrowed_balance_usd ?? 0)
);

const collateralLabel = computed(() => {
  const collateral = t("collateral");
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.usage {
  display: flex;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    flex-direction: column;
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

<i18n lang="yaml" locale="en">
collateral: Collateral
borrowed: Borrowed
supplied: Supplied

util-rate: Utilization Rate
util-rate-tooltip: Utilization rate is total supplied divided by total borrowed
</i18n>
