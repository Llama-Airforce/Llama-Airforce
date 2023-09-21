<template>
  <div class="vault">
    <div class="col">
      <TablePegkeepers></TablePegkeepers>
      <ChartPoolPrices></ChartPoolPrices>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useBreadcrumbStore } from "@PM/Stores/BreadcrumbStore";

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

.crvusd {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 5fr 4fr;

  > .col {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    div {
      flex-grow: 0;
    }
  }

  .row {
    display: flex;
    gap: var(--dashboard-gap);

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }

    div {
      flex-grow: 1;
    }
  }
}
</style>
