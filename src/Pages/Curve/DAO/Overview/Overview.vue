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
import AsyncValue from "@/Framework/AsyncValue.vue";
import KPI from "@/Framework/KPI.vue";
import GraphGauges from "@/Pages/Curve/DAO/Overview/Components/GraphGauges.vue";
import GraphLocked from "@/Pages/Curve/DAO/Overview/Components/GraphLocked.vue";
import GraphVersus from "@/Pages/Curve/DAO/Overview/Components/GraphVersus.vue";
import GraphEmissions from "@/Pages/Curve/DAO/Overview/Components/GraphEmissions.vue";

// Refs
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.overview {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    > .vecrv {
      display: flex;
      justify-content: space-evenly;
      flex-grow: 1;
      gap: 1.5rem;
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
      gap: 1.5rem;
      height: 300px;
    }
  }
}
</style>
