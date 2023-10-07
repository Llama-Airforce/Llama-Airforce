<template>
  <div class="kpis">
    <KPI
      label="TVL"
      :has-value="!!vault"
    >
      <AsyncValue
        v-if="vault"
        :value="vault.tvl"
        :precision="2"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Debt / Debt Cap"
      :has-value="!!vault"
    >
      <AsyncValue
        v-if="vault"
        :value="vault.debt"
        :precision="1"
        type="dollar"
      ></AsyncValue>
      /
      <AsyncValue
        v-if="vault"
        :value="vault.debt_cap"
        :precision="1"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Collat Ratio / Min Ratio"
      :has-value="!!vault"
    >
      <AsyncValue
        v-if="vault"
        :value="vault.cr * 100"
        :precision="0"
        type="percentage"
      ></AsyncValue>

      /

      <AsyncValue
        v-if="vault"
        :value="vault.mcr * 100"
        :precision="0"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Interest rate"
      :has-value="!!vault"
    >
      <AsyncValue
        v-if="vault"
        :value="vault.rate * 100"
        :show-zero="true"
        :precision="1"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Troves open / total"
      :has-value="!!vault"
    >
      <AsyncValue
        v-if="vault"
        :value="vault.open_troves"
        :show-zero="true"
        :precision="0"
      ></AsyncValue>

      /

      <AsyncValue
        v-if="vault"
        :value="vault.open_troves + vault.closed_troves"
        :show-zero="true"
        :precision="0"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Liquidations / Redemptions"
      :has-value="!!vault"
    >
      <AsyncValue
        v-if="vault"
        :value="vault.liq_troves"
        :show-zero="true"
        :precision="0"
      ></AsyncValue>

      /

      <AsyncValue
        v-if="vault"
        :value="vault.red_troves"
        :show-zero="true"
        :precision="0"
      ></AsyncValue>
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { AsyncValue, KPI } from "@/Framework";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.kpis {
  display: flex;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
