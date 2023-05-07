<template>
  <div class="kpis">
    <KPI
      label="CRV price"
      value="$3.14"
      :has-value="true"
    >
    </KPI>

    <KPI
      label="CRV market cap"
      :has-value="true"
      value="$3.14b"
    >
    </KPI>

    <KPI
      label="Total Value Locked"
      :has-value="true"
      value="$69b"
    >
    </KPI>

    <KPI
      label="7-day Volume"
      :has-value="true"
      value="$42b"
    >
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { KPI } from "@/Framework";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.kpis {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
}
</style>
