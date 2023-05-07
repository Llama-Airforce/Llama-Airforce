<template>
  <div class="utilization">
    <div class="dashboard">
      <GraphRatios class="graph-ratios"></GraphRatios>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { minDelay } from "@/Util";
import GraphRatios from "@LAF/Pages/Curve/Utilization/Components/GraphRatios.vue";
import GaugeRatiosService from "@LAF/Pages/Curve/Utilization/Services/GaugeRatiosService";
import { useCurveStore } from "@LAF/Pages/Curve/Store";
import { getHost } from "@/Services/Host";

const gaugeRatiosService = new GaugeRatiosService(getHost());

// Refs
const store = useCurveStore();

// Hooks
onMounted(async (): Promise<void> => {
  const resp = await minDelay(gaugeRatiosService.get());
  if (resp) {
    const gauges = resp.ratios;
    for (const gauge of gauges) {
      store.setRatios(gauge.name, gauge.ratios);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("utilization");

.utilization {
  .dashboard {
    .graph-ratios {
      grid-column: 1 / span 2;
      grid-row: 1;

      height: 2000px;
    }
  }
}
</style>
