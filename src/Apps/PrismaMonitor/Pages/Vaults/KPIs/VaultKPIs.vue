<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";

const { vault = null } = defineProps<{
  vault?: TroveManagerDetails | null;
}>();
</script>

<template>
  <div class="kpis">
    <KPI
      label="TVL"
      :has-value="!!vault"
    >
      <div class="kpi-body">
        <AsyncValue
          v-if="vault"
          type="dollar"
          :value="vault.tvl"
          :precision="2"
        ></AsyncValue>
      </div>
    </KPI>

    <KPI
      label="Debt / Debt Cap"
      :has-value="!!vault"
    >
      <div class="kpi-body">
        <AsyncValue
          v-if="vault"
          type="dollar"
          :value="vault.debt"
          :precision="1"
        ></AsyncValue>
        /
        <AsyncValue
          v-if="vault"
          type="dollar"
          :value="vault.debt_cap"
          :precision="1"
        ></AsyncValue>
      </div>
    </KPI>

    <KPI
      label="Collat Ratio / Min Ratio"
      :has-value="!!vault"
    >
      <div class="kpi-body">
        <AsyncValue
          v-if="vault"
          type="percentage"
          :value="vault.cr * 100"
          :precision="0"
        ></AsyncValue>

        /

        <AsyncValue
          v-if="vault"
          type="percentage"
          :value="vault.mcr * 100"
          :precision="0"
        ></AsyncValue>
      </div>
    </KPI>

    <KPI
      label="Interest rate"
      :has-value="!!vault"
    >
      <div class="kpi-body">
        <AsyncValue
          v-if="vault"
          show-zero
          type="percentage"
          :value="vault.rate * 100"
          :precision="1"
        ></AsyncValue>
      </div>
    </KPI>

    <KPI
      label="Troves open / total"
      :has-value="!!vault"
    >
      <div class="kpi-body">
        <AsyncValue
          v-if="vault"
          show-zero
          :value="vault.open_troves"
          :precision="0"
        ></AsyncValue>

        /

        <AsyncValue
          v-if="vault"
          show-zero
          :value="vault.open_troves + vault.closed_troves"
          :precision="0"
        ></AsyncValue>
      </div>
    </KPI>

    <KPI
      label="Liquidations / Redemptions"
      :has-value="!!vault"
    >
      <div class="kpi-body">
        <AsyncValue
          v-if="vault"
          show-zero
          :value="vault.liq_troves"
          :precision="0"
        ></AsyncValue>

        /

        <AsyncValue
          v-if="vault"
          show-zero
          :value="vault.red_troves"
          :precision="0"
        ></AsyncValue>
      </div>
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: flex;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 1fr 1fr;
  }

  .kpi-body {
    display: flex;
    gap: 0.5ch;
  }
}
</style>
