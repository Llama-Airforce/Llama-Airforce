<template>
  <div class="overview">
    <div class="dashboard">
      <div class="vecrv">
        <KPI
          label="% CRV Locked"
          :has-value="true"
        >
          <AsyncValue
            :value="48.84"
            :precision="2"
            type="percentage"
          />
        </KPI>

        <KPI
          label="Total veCRV"
          :has-value="true"
        >
          <AsyncValue
            :value="550_351_944"
            :precision="2"
            :show-symbol="false"
            type="dollar"
          />
        </KPI>

        <KPI
          label="Avg lock duration in years"
          :has-value="true"
        >
          <AsyncValue
            :value="3.64"
            :precision="2"
          />
        </KPI>
      </div>

      <div class="gauges">
        <GraphGauges></GraphGauges>
      </div>

      <div class="graphs">
        <GraphLocked></GraphLocked>
        <GraphVersus></GraphVersus>
        <GraphEmissions></GraphEmissions>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AsyncValue, KPI } from "@/Framework";
import GraphGauges from "@LAF/Pages/Curve/DAO/Overview/Components/GraphGauges.vue";
import GraphLocked from "@LAF/Pages/Curve/DAO/Overview/Components/GraphLocked.vue";
import GraphVersus from "@LAF/Pages/Curve/DAO/Overview/Components/GraphVersus.vue";
import GraphEmissions from "@LAF/Pages/Curve/DAO/Overview/Components/GraphEmissions.vue";

// Refs
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("overview");

.overview {
  .dashboard {
    > .vecrv {
      display: flex;
      justify-content: space-evenly;
      flex-grow: 1;
      gap: var(--dashboard-gap);
    }

    > .gauges {
      > .graph-mock {
        height: 370px;
      }
    }

    > .graphs {
      display: flex;
      justify-content: space-evenly;
      flex-grow: 1;
      gap: var(--dashboard-gap);
      height: 300px;
    }
  }
}
</style>
