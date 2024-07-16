<template>
  <div class="home">
    <div class="controls-container">
      <InputText
        v-model="pool"
        class="search"
        placeholder="Search for a pool: enter a space here"
        :search="true"
      >
      </InputText>

      <!-- <Controls></Controls> -->
    </div>

    <div class="data-1">
      <KPIs></KPIs>
      <ChartChainType></ChartChainType>
      <ChartLiquidityTop></ChartLiquidityTop>
    </div>

    <div class="data-2">
      <TableTrades></TableTrades>
      <ChartRanking></ChartRanking>
    </div>
  </div>
</template>

<script setup lang="ts">
import KPIs from "@CM/Pages/Home/Components/KPIs.vue";
import {
  ChartChainType,
  ChartLiquidityTop,
  ChartRanking,
} from "@CM/Pages/Home/Charts";
import TableTrades from "@CM/Pages/Home/Tables/TableTrades.vue";

// Refs
const pool = ref("");
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("home");

.home {
  max-width: calc(1920px - 18.125rem);
}

.controls-container {
  display: none;

  box-shadow: var(--container-box-shadow);
  border-radius: var(--border-radius);
  overflow: hidden;

  :deep(.search) {
    input {
      background: var(--c-lvl1);
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border: 0;
    }
  }
}

.data-1 {
  display: grid;
  grid-template-columns: 10rem 1fr 1fr;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}

.data-2 {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
