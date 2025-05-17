<script setup lang="ts">
import type { EpochOverview, Overview } from "../../Models";
import { useBribesStore } from "../../Store";
import { vlAssetSymbol } from "../../Util/ProtocolHelper";

const { t } = useI18n();

const { overview } = defineProps<{
  overview?: Overview;
}>();

const { protocol } = storeToRefs(useBribesStore());

const epochs = computed((): EpochOverview[] => overview?.epochs ?? []);

const recordEarningsLabel = computed((): string =>
  t("record-earnings", [vlAssetSymbol(protocol.value)])
);

const totalRevenue = computed((): number =>
  epochs.value.sumBy((epoch) => epoch.totalAmountDollars)
);

const rewardPerDollarBribe = computed(
  (): number => overview?.rewardPerDollarBribe ?? 0
);

const recordEarningPerVlAsset = computed((): number =>
  Math.max(...epochs.value.map((epoch) => epoch.dollarPerVlAsset))
);

const rewardsPerDollarBribeTooltip = computed((): string => {
  let tokens = "???";

  switch (protocol.value) {
    case "cvx-crv":
      tokens = "CRV";
      break;
    case "cvx-prisma":
      tokens = "PRISMA";
      break;
    case "cvx-fxn":
      tokens = "FXN";
      break;
    case "aura-bal":
      tokens = "BAL + AURA";
      break;
    case null:
    default:
      tokens = "???";
  }

  return t("tooltip", [tokens]);
});
</script>

<template>
  <div class="summary">
    <KPI
      class="all-time-revenue"
      :label="t('all-time-revenue')"
      :has-value="!!totalRevenue"
    >
      <AsyncValue
        type="dollar"
        :value="totalRevenue"
        :precision="2"
      />
    </KPI>

    <KPI
      class="emissions-per-bribe"
      :label="t('emissions')"
      :has-value="!!rewardPerDollarBribe"
      :tooltip="rewardsPerDollarBribeTooltip"
    >
      <AsyncValue
        type="dollar"
        :value="rewardPerDollarBribe"
        :precision="2"
      />
    </KPI>

    <KPI
      class="record-earnings"
      :label="recordEarningsLabel"
      :has-value="!!recordEarningPerVlAsset"
    >
      <AsyncValue
        type="dollar"
        :value="recordEarningPerVlAsset"
        :precision="5"
      />
    </KPI>
  </div>
</template>

<style scoped>
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

    .emissions-per-bribe > .record-earnings {
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
tooltip: >-
  This statistic is for <u><strong>bribers</strong></u>:<br />
  It tells you how much gauge emission rewards ({0}) liquidity providers will get for each dollar spent on pool bribes.<br />
  A value above $1 means that it's cheaper to bribe compared to directly handing out liquidity mining rewards.
</i18n>
