<template>
  <div class="overview">
    <div class="dashboard">
      <GraphRatios class="graph-ratios"></GraphRatios>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { onMounted } from "vue";
import GraphRatios from "@/Pages/Curve/Utilization/Components/GraphRatios.vue";
import GaugeRatiosService from "@/Pages/Curve/Utilization/Services/GaugeRatiosService";
import { minDelay } from "@/Util/PromiseHelper";
import { useCurveStore } from "@/Pages/Curve/Store";
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

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.overview {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: grid;

    grid-template-rows: auto;
    grid-template-columns: auto;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .graph-ratios {
      grid-column: 1 / span 2;
      grid-row: 2;

      height: 2000px;
    }
  }
}
</style>
