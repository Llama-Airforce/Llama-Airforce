<template>
  <div class="pools">
    <div class="dashboard">
      <div
        class="revenues"
      >
        <GraphPoolRevenue
          title="Historical revenue breakdown"
          class="graph-pool-revenue"
        ></GraphPoolRevenue>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>

import {onMounted} from "vue";
import RevenueService from "@/Pages/Curve/Revenue/Services/RevenueService";
import {minDelay} from "@/Util/PromiseHelper";
import {useCurveStore} from "@/Pages/Curve/Store";
import {getHost} from "@/Services/Host";
import GraphPoolRevenue from "@/Pages/Curve/Revenue/Components/GraphPoolRevenue.vue";

const revenueService = new RevenueService(getHost());

// Refs
const store = useCurveStore();

onMounted(async (): Promise<void> => {
  const revenues = await minDelay(revenueService.get(), 500);

  if (revenues) {
    store.setPoolRevenues(revenues);
  }
});

</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.pools {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .revenues {
      position: relative;
      grid-column: 1;
      grid-row: 2;

      display: grid;
      grid-template-rows: 600px 400px;
      gap: 1rem;

      .graph-pool-revenues {
        grid-row: 1;
      }
    }
  }
}
</style>
