<template>
  <div class="vaults">
    <TableVaults
      style="grid-column: 1 / -1"
      @selected="onMarketSelect"
    ></TableVaults>
    <ChartCollateralRatio></ChartCollateralRatio>
    <ChartRatioDeciles></ChartRatioDeciles>
    <ChartGlobalCollateral></ChartGlobalCollateral>
    <ChartOpenTroves></ChartOpenTroves>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useBreadcrumbStore } from "@PM/Stores/BreadcrumbStore";
import ChartOpenTroves from "@PM/Pages/Vaults/Charts/ChartOpenTroves.vue";
import ChartCollateralRatio from "@PM/Pages/Vaults/Charts/ChartCollateralRatio.vue";
import ChartRatioDeciles from "@PM/Pages/Vaults/Charts/ChartRatioDeciles.vue";
import ChartGlobalCollateral from "@PM/Pages/Vaults/Charts/ChartGlobalCollateral.vue";
import TableVaults from "@PM/Pages/Vaults/Tables/TableVaults.vue";
// Refs

const storeBreadcrumb = useBreadcrumbStore();

// Hooks
onMounted(() => {
  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
  ];
});

</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("vaults");

.vaults {
  max-width: calc(1920px - 18.125rem);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
