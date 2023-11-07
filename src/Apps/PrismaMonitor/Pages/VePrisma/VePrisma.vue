<template>
  <div class="veprisma">
    <TableLockers
      style="grid-column: 1"
      :loading="loading"
      :lockers="lockers"
    ></TableLockers>

    <ChartTopLockers
      style="grid-column: 2"
      :loading="loading"
      :lockers="lockers"
    ></ChartTopLockers>
  </div>
</template>

<script setup lang="ts">
import { useData } from "@/Framework";
import { getHost } from "@/Services/Host";
import TableLockers from "@PM/Pages/VePrisma/Tables/TableLockers.vue";
import ChartTopLockers from "@PM/Pages/VePrisma/Charts/ChartTopLockers.vue";
import VePrismaService from "@PM/Pages/VePrisma/VePrismaService";

const vePrismaService = new VePrismaService(getHost());

const { loading, data: lockers } = useData(
  () => vePrismaService.getTopLockers(),
  []
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("veprisma");

.veprisma {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr;
}
</style>
