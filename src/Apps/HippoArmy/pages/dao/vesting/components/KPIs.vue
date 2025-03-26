<script setup lang="ts">
import {
  useRedemptions,
  useAirdropsTeam,
  useAirdropsVictims,
  useCirculatingSupply,
} from "@HA/queries/vesting";

const chain = { chain: "ethereum" };
const { data: redemptions } = useRedemptions(chain);
const { data: airdropsTeam } = useAirdropsTeam(chain);
const { data: airdropsVictims } = useAirdropsVictims(chain);
const { data: supply } = useCirculatingSupply();

const totalAllocated = computed(() => {
  if (!redemptions.value || !airdropsTeam.value || !airdropsVictims.value)
    return null;

  return (
    redemptions.value.totalAllocation +
    airdropsTeam.value.totalAllocation +
    airdropsVictims.value.totalAllocation
  );
});

const totalClaimed = computed(() => {
  if (!redemptions.value || !airdropsTeam.value || !airdropsVictims.value)
    return null;
  return (
    redemptions.value.totalClaimed +
    airdropsTeam.value.totalClaimed +
    airdropsVictims.value.totalClaimed
  );
});

const totalClaimPercentage = computed(() => {
  if (!totalAllocated.value || !totalClaimed.value) return null;
  return (totalClaimed.value / totalAllocated.value) * 100;
});
</script>

<template>
  <div class="kpis">
    <KPI
      label="Total Allocated"
      :has-value="!!totalAllocated"
    >
      <AsyncValue
        type="dollar"
        :value="totalAllocated"
        :precision="2"
        :show-symbol="false"
      />
      reUSD
    </KPI>

    <KPI
      label="Total Claimed"
      :has-value="!!totalClaimed"
    >
      <AsyncValue
        type="dollar"
        :value="totalClaimed"
        :precision="2"
        :show-symbol="false"
      />
      reUSD
    </KPI>

    <KPI
      label="Claim Percentage"
      :has-value="!!totalClaimPercentage"
    >
      <AsyncValue
        type="percentage"
        :value="totalClaimPercentage"
        :precision="2"
      />
    </KPI>

    <KPI
      label="Circulating Supply"
      :has-value="!!supply?.circulatingSupply"
    >
      <AsyncValue
        type="dollar"
        :value="supply?.circulatingSupply"
        :precision="2"
        :show-symbol="false"
      />
      reUSD
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--dashboard-gap);
}
</style>
