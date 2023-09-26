<template>
  <div class="pool">
    <ChartPoolTvl></ChartPoolTvl>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useBreadcrumbStore } from "@PM/Stores/BreadcrumbStore";
import ChartPoolTvl from "@PM/Pages/Pool/Charts/ChartPoolTvl.vue";

// Refs
const storeBreadcrumb = useBreadcrumbStore();

// Hooks
onMounted(() => {
  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "pool",
      label: "Stability Pool",
      pathName: "pool",
    },
  ];
});


</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pool");

.pool {
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
