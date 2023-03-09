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
      class="emissions-per-bribe"
      :label="t('emissions')"
      :has-value="!!rewardPerDollarBribe"
      :tooltip="rewardsPerDollarBribeTooltip"
    >
      <AsyncValue
        :value="rewardPerDollarBribe"
        :precision="2"
        type="dollar"
      />
    </KPI>

    <KPI
      class="record-earnings"
      :label="recordEarningsLabel"
      :has-value="!!recordEarningPerVlAsset"
    >
      <AsyncValue
        :value="recordEarningPerVlAsset"
        :precision="5"
        type="dollar"
      />
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { AsyncValue, KPI } from "@/Framework";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import type {
  EpochOverview,
  Overview,
  Protocol,
} from "@LAF/Pages/Bribes/Models";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";

const { t } = useI18n();

// Refs
const store = useBribesStore();

const overview = computed((): Overview | null => {
  return store.selectedOverview;
});

const epochs = computed((): EpochOverview[] => {
  return overview.value?.epochs ?? [];
});

const protocol = computed((): Protocol | null => {
  return store.selectedProtocol;
});

const recordEarningsLabel = computed((): string => {
  return t("record-earnings", [vlAssetSymbol(protocol.value)]);
});

const totalRevenue = computed((): number => {
  return epochs.value.reduce((acc, epoch) => acc + epoch.totalAmountDollars, 0);
});

const rewardPerDollarBribe = computed((): number => {
  return overview.value?.rewardPerDollarBribe ?? 0;
});

const recordEarningPerVlAsset = computed((): number => {
  return Math.max(...epochs.value.map((epoch) => epoch.dollarPerVlAsset));
});

const rewardsPerDollarBribeTooltip = computed((): string => {
  let tokens = "???";

  switch (protocol.value) {
    case "cvx-crv":
      tokens = "CRV + CVX";
      break;
    case "aura-bal":
      tokens = "BAL + AURA";
      break;
    default:
      tokens = "???";
  }

  return t("tooltip", [tokens]);
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.summary {
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  gap: 1.5rem;

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 1fr;

    > .emissions-per-bribe {
      grid-row: 1;
      grid-column: 1 / span 2;
    }

    > .all-time-revenue {
      grid-row: 2;
      grid-column: 1;
    }
    emissions-per-bribe > .record-earnings {
      grid-row: 2;
      grid-column: 2;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
all-time-revenue: All time revenue
emissions: Emissions / $1 spent on bribes
record-earnings: Record earnings per {0}
tooltip: "This statistic is for <u><strong>bribers</strong></u>:<br />
  It tells you how much gauge emission rewards ({0}) liquidity providers will get for each dollar spent on pool bribes.<br />
  A value above $1 means that it's cheaper to bribe compared to directly handing out liquidity mining rewards."
</i18n>
